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
        Cell::new(&format!("{}", "Name".bold())),
        Cell::new(&format!("{}", "Path".bold())),
        Cell::new(&format!("{}", "Start Date".bold())),
        Cell::new(&format!("{}", "Is Active".bold())),
    ]));

    for watcher in watchers {
        let activity = if watcher.is_active {
            watcher.is_active.to_string().green().bold()
        } else {
            watcher.is_active.to_string().red().bold()
        };
        table.add_row(Row::new(vec![
            Cell::new(&format!("{}", &watcher.name.blue().bold())),
            Cell::new(&watcher.path),
            Cell::new(&watcher.start_date),
            Cell::new(&format!("{}", activity)),
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
