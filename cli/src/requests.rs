use chrono;
use colored::*;

use reqwest::{Client, Response};
use serde_json::json;

use crate::utils::{display_watchers, server_off, Watcher};
const PORT: u32 = 50011;

// This code handles all interactions with the local database, each user argument triggers one of these functions (with the exception of display and uninstall).

enum Method {
    Get,
    Delete,
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

async fn request(url: &str, method: &Method) -> Result<Response, reqwest::Error> {
    let client = Client::new();

    let request = match method {
        Method::Get => client.get(url),
        Method::Delete => client.delete(url),
        Method::Post { body } => client
            .post(url)
            .header("Content-Type", "application/json")
            .body(body.clone()),
        Method::Patch { body } => client
            .patch(url)
            .header("Content-Type", "application/json")
            .body(body.clone()),
    };

    match request.send().await {
        Ok(response) => Ok(response),
        Err(err) => Err(err),
    }
}

pub async fn add(path_to_watch: &String, watcher_name: &String) {
    let current_date = chrono::Local::now().to_rfc3339();
    let body = json!({"name": &watcher_name, "path": &path_to_watch, "start_date": current_date, "is_active": true}).to_string();
    let url = &format!("http://127.0.0.1:{}/api/watchers/", PORT);

    match request(url, &Method::Post { body }).await {
        Ok(response) => status_message(response, "Watcher succesfully added").await,
        Err(err) => server_off(&err),
    }
}

pub async fn ls() {
    let url = &format!("http://127.0.0.1:{}/api/watchers/", PORT);

    match request(url, &Method::Get).await {
        Ok(response) => {
            let watchers = response.json::<Vec<Watcher>>().await.unwrap();
            display_watchers(&watchers);
        }
        Err(err) => server_off(&err),
    }
}

pub async fn update(watcher_name: &String, new_path: &String) {
    let body = json!({ "path": &new_path }).to_string();
    let url = format!("http://127.0.0.1:{}/api/watchers/{}", PORT, &watcher_name);

    match request(&url, &Method::Patch { body }).await {
        Ok(response) => status_message(response, "Path succesfully updated").await,
        Err(err) => server_off(&err),
    }
}

pub async fn start(watcher_name: &String) {
    let body = json!({ "is_active": true }).to_string();
    let url = format!("http://127.0.0.1:{}/api/watchers/{}", PORT, &watcher_name);

    match request(&url, &Method::Patch { body }).await {
        Ok(response) => status_message(response, "Watcher succesfully started").await,
        Err(err) => server_off(&err),
    }
}

pub async fn stop(watcher_name: &String) {
    let body = json!({ "is_active": false }).to_string();
    let url = format!("http://127.0.0.1:{}/api/watchers/{}", PORT, &watcher_name);

    match request(&url, &Method::Patch { body }).await {
        Ok(response) => status_message(response, "Watcher succesfully stopped").await,
        Err(err) => server_off(&err),
    }
}

pub async fn rename(old_name: &String, new_name: &String) {
    let body = json!({ "name": new_name }).to_string();
    let url = format!("http://127.0.0.1:{}/api/watchers/{}", PORT, &old_name);

    match request(&url, &Method::Patch { body }).await {
        Ok(response) => status_message(response, "Watcher succesfully renamed").await,
        Err(err) => server_off(&err),
    }
}

pub async fn remove(watcher_name: &String) {
    let url = format!("http://127.0.0.1:{}/api/watchers/{}", PORT, &watcher_name);

    match request(&url, &Method::Delete).await {
        Ok(response) => status_message(response, "Watcher succesfully deleted").await,
        Err(err) => server_off(&err),
    }
}

pub async fn remove_all() {
    let url = &format!("http://127.0.0.1:{}/api/watchers/", PORT);

    match request(url, &Method::Delete).await {
        Ok(response) => status_message(response, "All watchers succesfully deleted").await,
        Err(err) => server_off(&err),
    }
}

pub async fn reset(watcher_name: &String) {
    let url = format!(
        "http://127.0.0.1:{}/api/working_periods/{}",
        PORT, &watcher_name
    );

    match request(&url, &Method::Delete).await {
        Ok(response) => status_message(response, "Watcher succesfully reseted").await,
        Err(err) => server_off(&err),
    }
}

pub async fn reset_all() {
    let url = &format!("http://127.0.0.1:{}/api/working_periods/", PORT);

    match request(url, &Method::Delete).await {
        Ok(response) => status_message(response, "All watcher succesfully reseted").await,
        Err(err) => server_off(&err),
    }
}
