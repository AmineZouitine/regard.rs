#[macro_use]
extern crate rocket;

pub mod database;
mod routes;
mod services;

// import our routes
use routes::watchers::get_all_watchers;
use routes::watchers::new_watcher;

#[launch]
fn rocket() -> _ {
    if let Err(err) = database::init_database() {
        panic!("{:?}", err);
    }
    rocket::build().mount("/api", routes![new_watcher, get_all_watchers])
}
