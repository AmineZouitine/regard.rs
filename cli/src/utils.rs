use colored::*;
use prettytable::{Cell, Row, Table};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Watcher {
    pub id: i64,
    pub name: String,
    pub path: String,
    pub start_date: String,
    pub is_active: bool,
}

pub fn display_watchers(watchers: &[Watcher]) {
    let mut table = Table::new();
    table.add_row(Row::new(vec![
        Cell::new("Name"),
        Cell::new("Path"),
        Cell::new("Start Date"),
        Cell::new("Is Active"),
    ]));

    for watcher in watchers {
        table.add_row(Row::new(vec![
            Cell::new(&watcher.name),
            Cell::new(&watcher.path),
            Cell::new(&watcher.start_date),
            Cell::new(&watcher.is_active.to_string()),
        ]));
    }
    table.printstd();
}

pub fn server_off(err: &reqwest::Error) {
    println!(
        "{}: Look like the server is off. Please open an issue.\n\nError code: {:?}",
        "Error".red().bold(),
        err
    );
}
