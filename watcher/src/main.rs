use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{collections::HashMap, path::Path};

#[derive(Debug, Serialize, Deserialize)]
struct Watchers {
    id: i64,
    name: String,
    path: String,
    start_date: String,
}

async fn get_watchers() -> Result<Vec<Watchers>, &'static str> {
    let client = Client::new();
    let response = client
        .get("http://127.0.0.1:8000/api/watchers/")
        .send()
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // on success, parse our JSON to an APIResponse
            match response.json::<Vec<Watchers>>().await {
                Ok(watchers) => Ok(watchers),
                Err(_) => Err("Hm, the response didn't match the shape we expected."),
            }
        }
        _ => Err("Uh oh! Something unexpected happened"),
    }
}

fn build_mapping(watchers: &Vec<Watchers>) -> HashMap<&String, &String> {
    let mut mapping = HashMap::new();
    for watcher in watchers {
        mapping.insert(&watcher.path, &watcher.name);
    }
    mapping
}

#[tokio::main]
async fn main() {
    let paths = vec!["oui.txt", "test.txt"];
    let watchers = get_watchers().await.unwrap();

    let path_name_mapping = build_mapping(&watchers);

    watch(&paths, &path_name_mapping).await.unwrap();
}

async fn watch(
    paths: &[&str],
    path_name_mapping: &HashMap<&String, &String>,
) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default())?;

    for path in paths {
        watcher.watch(Path::new(path), RecursiveMode::Recursive)?;
    }

    for res in rx {
        match res {
            Ok(event) => {
                if let EventKind::Access(_) = event.kind {
                    if path_name_mapping.contains_key(&event.paths[0].to_string_lossy().to_string())
                    {
                        let watcher_name = path_name_mapping
                            .get(&event.paths[0].to_string_lossy().to_string())
                            .unwrap();
                        println!("WATCHER_NAME = {:?}", watcher_name);

                        let client = Client::new();
                        let body = json!({"date": "coucou", "additions": 2, "deletions": 1});
                        let response = client
                            .post(format!(
                                "http://127.0.0.1:8000/api/working_periods/{}",
                                watcher_name
                            ))
                            .header("Content-Type", "application/json")
                            .body(body.to_string())
                            .send()
                            .await
                            .unwrap();
                        println!("Status = {:?}", response.status());
                    }
                    println!("Path {:?}", event.paths[0].to_str());
                    println!("Modification");
                }
            }
            Err(e) => println!("watch error: {:?}", e),
        }
    }

    Ok(())
}
