use crate::database;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

use crate::services::watchers;

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct WorkingPeriods {
    pub id: Option<i64>,
    pub date: String,
    pub watcher_id: Option<i64>,
}

pub fn init_working_periods(
    working_periods: &Json<WorkingPeriods>,
    name: &str,
) -> Result<(), rusqlite::Error> {
    let watcher = watchers::select_by_name_watchers(name)?;
    let connection = database::SQLITE_CONNECTION.lock().unwrap();

    connection.execute(
        "INSERT INTO working_periods (date, watcher_id) values (?1, ?2)",
        (&working_periods.date, &watcher.id),
    )?;

    Ok(())
}

pub fn select_all_by_watcher_id_working_periods(
    id: i64,
) -> Result<Vec<WorkingPeriods>, rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();

    let mut stmt = connection.prepare("SELECT * from working_periods WHERE watcher_id = ?")?;

    let mut working_periods = Vec::new();
    let selected_working_periods = stmt.query_map((id,), |row| {
        Ok(WorkingPeriods {
            id: row.get(0)?,
            date: row.get(1)?,
            watcher_id: row.get(2)?,
        })
    })?;

    for working_period in selected_working_periods {
        working_periods.push(working_period?);
    }

    Ok(working_periods)
}
