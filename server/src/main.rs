#[macro_use]
extern crate rocket;

pub mod database;
mod routes;
mod services;

use rocket::Config;
// import our routes
use routes::watchers::delete_all_watchers;
use routes::watchers::delete_by_name_watcher;
use routes::watchers::get_all_active_watchers;
use routes::watchers::get_all_watchers;
use routes::watchers::get_by_name_watcher;
use routes::watchers::new_watcher;
use routes::watchers::patch_watcher;
use routes::working_periods::get_by_wacher_id_working_periods;
use routes::working_periods::new_working_periods;
use std::env;

#[launch]
fn rocket() -> _ {
    let mut args: Vec<String> = env::args().collect();

    if args.len() == 1 {
        args.push("7777".to_string());
    }

    let port_str = &args[1];
    let port: u16 = match port_str.parse() {
        Ok(num) => num,
        Err(_) => panic!("Invalid port number: {}", port_str),
    };

    if let Err(err) = database::init_database() {
        panic!("{:?}", err);
    }

    database::SQLITE_CONNECTION
        .lock()
        .unwrap()
        .execute("PRAGMA foreign_keys = ON;", [])
        .unwrap();

    let config = Config {
        port,
        ..Config::debug_default()
    };
    rocket::build()
        .mount(
            "/api",
            routes![
                new_watcher,
                new_working_periods,
                get_by_name_watcher,
                patch_watcher,
                get_by_wacher_id_working_periods,
                get_all_active_watchers,
                delete_by_name_watcher,
                delete_all_watchers,
                get_all_watchers
            ],
        )
        .configure(config)
}
