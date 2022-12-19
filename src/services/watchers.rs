use crate::database;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rusqlite::params;

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Watchers {
    pub id: Option<i64>,
    pub name: String,
    pub start_date: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct WorkingPeriods {
    pub id: Option<i64>,
    pub date: String,
    pub additions: u64,
    pub deletions: u64,
}

pub fn init_watchers(watcher: &Json<Watchers>) -> Result<(), rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    connection.execute(
        "INSERT INTO watchers (name, start_time) values (?1, ?2)",
        (&watcher.name, &watcher.start_date),
    )?;

    Ok(())
}

pub fn select_all_watchers() -> Result<Vec<Watchers>, rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    let mut stmt = connection.prepare("SELECT * from watchers")?;

    let mut watchers = Vec::new();
    let selected_watchers = stmt.query_map(params![], |row| {
        Ok(Watchers {
            id: row.get(0)?,
            name: row.get(1)?,
            start_date: row.get(2)?,
        })
    })?;

    for watcher in selected_watchers {
        watchers.push(watcher?);
    }

    Ok(watchers)
}

pub fn select_by_name_watchers(watcher_name: Json<&String>) -> Result<Watchers, rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    let mut stmt = connection.prepare("SELECT * from watchers WHERE name = ?")?;
    println!("[{:?}]", watcher_name.as_str());
    let element = stmt.query_row(&[watcher_name.as_str()], |row| {
        Ok(Watchers {
            id: row.get(0)?,
            name: row.get(1)?,
            start_date: row.get(2)?,
        })
    })?;
    Ok(element)
}
