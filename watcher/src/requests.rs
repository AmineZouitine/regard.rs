use futures::future::ok;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct Watchers {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub start_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkingPeriods {
    pub date: String,
    pub additions: u64,
    pub deletions: u64,
}

pub async fn get_watchers() -> Result<Vec<Watchers>, &'static str> {
    let client = Client::new();
    let response = client
        .get("http://127.0.0.1:8000/api/watchers/active")
        .send()
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // on success, parse our JSON to an APIResponse
            match response.json::<Vec<Watchers>>().await {
                Ok(mut watchers) => {
                    path_verifications(&mut watchers).await;
                    Ok(watchers)
                }
                Err(_) => Err("The response didn't match the shape we expected."),
            }
        }
        _ => Err("Something unexpected happened"),
    }
}

async fn path_verifications(watchers: &mut Vec<Watchers>) {
    let watchers_to_remove = watchers
        .iter()
        .filter(|watcher| !Path::new(&watcher.path).exists())
        .map(|watcher| &watcher.name)
        .collect::<Vec<_>>();

    for name in watchers_to_remove {
        make_watcher_inactive(name).await.unwrap();
    }

    watchers.retain(|watcher| Path::new(&watcher.path).exists());
}

pub async fn make_watcher_inactive(watcher_name: &str) -> Result<(), &'static str> {
    let body = json!({"is_active": false});
    let client = Client::new();
    client
        .post(format!(
            "http://127.0.0.1:8000/api/working_periods/{}",
            watcher_name
        ))
        .header("Content-Type", "application/json")
        .body(body.to_string())
        .send()
        .await
        .unwrap();

    Ok(())
}

// fn handle_modification(path: &str) {
//     if path_name_mapping.contains_key(&event.paths[0].to_string_lossy().to_string()) {
//         let watcher_name = path_name_mapping
//             .get(&event.paths[0].to_string_lossy().to_string())
//             .unwrap();
//         println!("WATCHER_NAME = {:?}", watcher_name);

//         let client = Client::new();
//         let body = json!({"date": "coucou", "additions": 2, "deletions": 1});
//         let response = client
//             .post(format!(
//                 "http://127.0.0.1:8000/api/working_periods/{}",
//                 watcher_name
//             ))
//             .header("Content-Type", "application/json")
//             .body(body.to_string())
//             .send()
//             .await
//             .unwrap();
//         println!("Status = {:?}", response.status());
//     }
// }
