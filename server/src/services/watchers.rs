use crate::database;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rusqlite::{params, ToSql};

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Watchers {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub start_date: String,
    pub is_active: bool,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct UpdateWatchers {
    pub name: Option<String>,
    pub path: Option<String>,
    pub is_active: Option<bool>,
}

pub fn init_watchers(watcher: &Json<Watchers>) -> Result<(), rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    connection.execute(
        "INSERT INTO watchers (name, path, start_time, is_active) values (?1, ?2, ?3, ?4)",
        (
            &watcher.name,
            &watcher.path,
            &watcher.start_date,
            &watcher.is_active,
        ),
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
            path: row.get(2)?,
            start_date: row.get(3)?,
            is_active: row.get(4)?,
        })
    })?;

    for watcher in selected_watchers {
        watchers.push(watcher?);
    }

    Ok(watchers)
}

pub fn select_all_active_watchers() -> Result<Vec<Watchers>, rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    let mut stmt = connection.prepare("SELECT * from watchers where is_active = ?")?;

    let mut watchers = Vec::new();
    let selected_watchers = stmt.query_map((true,), |row| {
        Ok(Watchers {
            id: row.get(0)?,
            name: row.get(1)?,
            path: row.get(2)?,
            start_date: row.get(3)?,
            is_active: row.get(4)?,
        })
    })?;

    for watcher in selected_watchers {
        watchers.push(watcher?);
    }

    Ok(watchers)
}

pub fn select_by_name_watchers(watcher_name: &str) -> Result<Watchers, rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    let mut stmt = connection.prepare("SELECT * from watchers WHERE name = ?")?;
    let element = stmt.query_row(&[watcher_name], |row| {
        Ok(Watchers {
            id: row.get(0)?,
            name: row.get(1)?,
            path: row.get(2)?,
            start_date: row.get(3)?,
            is_active: row.get(4)?,
        })
    })?;
    Ok(element)
}

pub fn delete_by_name_watchers(watcher_name: &str) -> Result<(), rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();
    connection.execute(
        "DELETE FROM watchers WHERE name = ?1",
        params![watcher_name],
    )?;
    Ok(())
}

pub fn patch_watcher(
    watcher_name: &str,
    update_watcher: &Json<UpdateWatchers>,
) -> Result<(), rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();

    let mut query = "UPDATE watchers SET".to_string();
    let mut params: Vec<&dyn ToSql> = Vec::new();

    let mut query_to_add = Vec::new();
    if let Some(path) = &update_watcher.name {
        query_to_add.push(" name = ?");
        params.push(path);
    }

    if let Some(path) = &update_watcher.path {
        query_to_add.push(" path = ?");
        params.push(path);
    }

    if let Some(is_active) = &update_watcher.is_active {
        query_to_add.push(" is_active = ?");
        params.push(is_active);
    }

    for (index, str) in query_to_add.iter().enumerate() {
        query.push_str(str);
        if index + 1 != query_to_add.len() {
            query.push(',');
        }
    }

    query.push_str(" WHERE name = ?");
    params.push(&watcher_name);

    let mut stmt = connection.prepare(&query)?;
    stmt.execute(&*params)?;

    Ok(())
}
