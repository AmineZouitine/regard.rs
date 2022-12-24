#[macro_use]
extern crate rocket;

pub mod database;
mod routes;
mod services;

use rocket::Config;
// import our routes
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};
use routes::watchers::delete_all_watchers;
use routes::watchers::delete_by_name_watcher;
use routes::watchers::get_all_active_watchers;
use routes::watchers::get_all_watchers;
use routes::watchers::get_by_name_watcher;
use routes::watchers::new_watcher;
use routes::watchers::patch_watcher;
use routes::working_periods::delete_all_working_periods;
use routes::working_periods::delete_by_watcher_name_working_periods;
use routes::working_periods::get_by_wacher_id_working_periods;
use routes::working_periods::new_working_periods;
use std::env;

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

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
                delete_all_working_periods,
                delete_by_watcher_name_working_periods,
                get_all_watchers
            ],
        )
        .configure(config)
        .attach(CORS)
}
