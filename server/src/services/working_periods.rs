use std::collections::HashMap;

use crate::database;
use chrono::DateTime;
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

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct WatcherTime {
    pub start_date: String,
    pub end_date: String,
    pub total_time: i64,
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

pub fn delete_by_watcher_name_working_periods(name: &str) -> Result<(), rusqlite::Error> {
    let watcher = watchers::select_by_name_watchers(name)?;
    let connection = database::SQLITE_CONNECTION.lock().unwrap();

    connection.execute(
        "DELETE FROM working_periods WHERE watcher_id = ?1",
        [watcher.id],
    )?;
    Ok(())
}

pub fn delete_all_working_periods() -> Result<(), rusqlite::Error> {
    let connection = database::SQLITE_CONNECTION.lock().unwrap();

    connection.execute("DELETE FROM working_periods", [])?;
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

    working_periods.sort_by(|a, b| {
        let a_date = DateTime::parse_from_rfc3339(&a.date).unwrap();
        let b_date = DateTime::parse_from_rfc3339(&b.date).unwrap();
        a_date.cmp(&b_date)
    });

    Ok(working_periods)
}

pub fn get_by_watcher_id_working_periods_time(
    id: i64,
) -> Result<Vec<WatcherTime>, rusqlite::Error> {
    let working_periods = select_all_by_watcher_id_working_periods(id)?;
    let mut watcher_times = Vec::new();

    let mut current_session = Vec::new();
    for period in working_periods {
        let period_date = DateTime::parse_from_rfc3339(&period.date).unwrap();
        if current_session.is_empty() {
            // If the current session is empty, add the working period to it
            current_session.push(period);
        } else {
            // If the current session is not empty, compare the difference in time with the last working period in the session
            let last_period = current_session.last().unwrap();
            let last_period_date = DateTime::parse_from_rfc3339(&last_period.date).unwrap();
            let time_difference = period_date
                .signed_duration_since(last_period_date)
                .num_seconds();

            if time_difference <= 200 && period_date.date_naive() == last_period_date.date_naive() {
                // If the difference in time is less than 2 minutes and the working periods are on the same day, add the working period to the current session
                current_session.push(period);
            } else {
                // If the difference in time is greater than 2 minutes or the working periods are on different days, create a new WatcherTime and add it to the watcher_times vector
                let start_date = current_session.first().unwrap().date.clone();
                let end_date = current_session.last().unwrap().date.clone();
                let total_time = calculate_total_time(&start_date, &end_date);
                let watcher_time = WatcherTime {
                    start_date,
                    end_date,
                    total_time,
                };
                watcher_times.push(watcher_time);
                // Reset the current session and add the current working period to it
                current_session = vec![period];
            }
        }
    }

    // Don't forget to add the last session to the watcher_times vector
    if !current_session.is_empty() {
        let start_date = current_session.first().unwrap().date.clone();
        let end_date = current_session.last().unwrap().date.clone();
        let total_time = calculate_total_time(&start_date, &end_date);
        let watcher_time = WatcherTime {
            start_date,
            end_date,
            total_time,
        };
        watcher_times.push(watcher_time);
    }

    Ok(watcher_times)
}

fn calculate_total_time(start_date: &String, end_date: &String) -> i64 {
    let start_date_time = DateTime::parse_from_rfc3339(start_date).unwrap();
    let end_date_time = DateTime::parse_from_rfc3339(end_date).unwrap();
    if start_date == end_date {
        1
    } else {
        end_date_time
            .signed_duration_since(start_date_time)
            .num_minutes()
    }
}

pub fn get_all_working_periods_time() -> Result<HashMap<String, Vec<WatcherTime>>, rusqlite::Error>
{
    let watchers = watchers::select_all_watchers()?;
    let mut working_periods_by_watcher = HashMap::new();

    for watcher in watchers {
        let watcher_id = watcher.id.unwrap();
        let watcher_name = watcher.name;
        let watcher_times = get_by_watcher_id_working_periods_time(watcher_id)?;
        working_periods_by_watcher.insert(watcher_name, watcher_times);
    }

    Ok(working_periods_by_watcher)
}
