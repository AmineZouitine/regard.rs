// import Rocket
#[macro_use]
extern crate rocket;

// add our routes and services modules
mod routes;
mod services;

// import our routes
// use routes::date::date_plus_month;
// use routes::date::get_current_date;

// start the web server and mount our get route at "/api". Can replace /api with anything
// or just leave it as "/" as the default location
#[launch]
fn rocket() -> _ {
    rocket::build().mount("/api", routes![])
}
