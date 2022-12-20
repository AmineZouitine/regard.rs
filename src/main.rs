#[macro_use]
extern crate rocket;

pub mod database;
mod routes;
mod services;

// import our routes
use routes::watchers::get_all_watchers;
use routes::watchers::get_by_name_watcher;
use routes::watchers::new_watcher;
use routes::working_periods::get_by_wacher_id_working_periods;
use routes::working_periods::new_working_periods;

#[launch]
fn rocket() -> _ {
    if let Err(err) = database::init_database() {
        panic!("{:?}", err);
    }
    rocket::build().mount(
        "/api",
        routes![
            new_watcher,
            new_working_periods,
            get_by_name_watcher,
            get_by_wacher_id_working_periods,
            get_all_watchers
        ],
    )
}
