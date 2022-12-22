use chrono;
use colored::*;
use reqwest::{Client, Response};
use serde_json::json;

enum Method {
    Get,
    Post { body: String },
    Patch { body: String },
}

async fn status_message(response: Response, succes_message: &str) {
    match response.status() {
        reqwest::StatusCode::OK => {
            println!("{}: {:?}", "Sucess".green().bold(), succes_message);
        }
        _ => {
            println!(
                "{}: {}",
                "Error".red().bold(),
                response.text().await.unwrap()
            )
        }
    }
}

async fn request(url: &str, method: &Method, succes_message: &str) {
    let client = Client::new();

    let request = match method {
        Method::Get => client.get(url),
        Method::Post { body } => client
            .post(url)
            .header("Content-Type", "application/json")
            .body(body.clone()),
        Method::Patch { body } => client
            .patch(url)
            .header("Content-Type", "application/json")
            .body(body.clone()),
    };

    let response = request.send().await.unwrap();
    status_message(response, succes_message).await;
}

pub async fn add(path_to_watch: &String, watcher_name: &String) {
    let current_date = chrono::offset::Local::now().to_string();
    let body = json!({"name": &watcher_name, "path": &path_to_watch, "start_date": current_date, "is_active": true}).to_string();
    let url = "http://127.0.0.1:7777/api/watchers/";

    request(url, &Method::Post { body }, "Watcher succesfully added").await;
}
