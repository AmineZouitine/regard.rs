use chrono;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct Watchers {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub start_date: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct WorkingPeriods {
    pub id: Option<i64>,
    pub date: String,
    pub watcher_id: Option<i64>,
}

pub async fn get_active_watchers() -> Result<Vec<Watchers>, &'static str> {
    let client = Client::new();
    let response = client
        .get("http://127.0.0.1:7777/api/watchers/active")
        .send()
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // on success, parse our JSON to an APIResponse
            match response.json::<Vec<Watchers>>().await {
                Ok(watchers) => Ok(watchers),
                Err(_) => Err("The response didn't match the shape we expected."),
            }
        }
        _ => Err("Something unexpected happened"),
    }
}

pub async fn make_watcher_inactive(watcher_name: &str) -> Result<(), &'static str> {
    let body = json!({"is_active": false});
    let client = Client::new();
    client
        .patch(format!(
            "http://127.0.0.1:7777/api/watchers/{}",
            watcher_name
        ))
        .header("Content-Type", "application/json")
        .body(body.to_string())
        .send()
        .await
        .unwrap();

    Ok(())
}

pub async fn new_working_periods(watcher_name: &str) -> Result<(), &'static str> {
    let current_date = chrono::Local::now().to_rfc3339();
    let body = json!({ "date": current_date });
    let client = Client::new();
    client
        .post(format!(
            "http://127.0.0.1:7777/api/working_periods/{}",
            watcher_name
        ))
        .header("Content-Type", "application/json")
        .body(body.to_string())
        .send()
        .await
        .unwrap();
    Ok(())
}

pub async fn get_working_periods(id: i64) -> Result<Vec<WorkingPeriods>, &'static str> {
    let client = Client::new();
    let response = client
        .get(format!("http://127.0.0.1:7777/api/working_periods/{}", id))
        .send()
        .await
        .unwrap();

    match response.status() {
        reqwest::StatusCode::OK => {
            // on success, parse our JSON to an APIResponse
            match response.json::<Vec<WorkingPeriods>>().await {
                Ok(working_periods) => Ok(working_periods),
                Err(_) => Err("The response didn't match the shape we expected."),
            }
        }
        _ => Err("Something unexpected happened"),
    }
}
