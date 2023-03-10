use rusqlite::params;
use rusqlite::Result;

extern crate rusqlite;
use lazy_static::lazy_static;
use std::sync::Mutex;

lazy_static! {
    pub static ref SQLITE_CONNECTION: Mutex<rusqlite::Connection> =
        Mutex::new(rusqlite::Connection::open("watch.db").unwrap());
}

pub fn init_database() -> Result<(), rusqlite::Error> {
    let connection = SQLITE_CONNECTION.lock().unwrap();
    connection.execute(
        "create table if not exists watchers (
             id integer primary key,
             name text not null unique,
             path text not null unique,
             start_time text not null,
             is_active bool not null
         )",
        params![],
    )?;
    connection.execute(
        "create table if not exists working_periods (
             id integer primary key,
             date TEXT NOT NULL,
             watcher_id integer NOT NULL references watchers(id) ON DELETE CASCADE
         )",
        params![],
    )?;

    Ok(())
}
