pub mod watchers;

use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};

// import services module
use crate::services;

// create a struct to hold our Date data
// need serialize/deserialize to convert to/from JSON
#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Date {
    pub day: u32,
    pub month: u32,
    pub year: i32,
}

#[post("/watchers", format = "json", data = "<date>")]
pub fn date_plus_month(date: Json<Date>) -> Json<Date> {}
