use rocket::http::Status;
use rocket::serde::json::Json;

// import services module
use crate::services::watchers;
use crate::services::watchers::Watchers;

#[post("/watchers", format = "json", data = "<watcher>")]
pub fn new_watcher(watcher: Json<Watchers>) -> Status {
    match watchers::init_watchers(&watcher) {
        Ok(()) => Status::Accepted,
        Err(err) => {
            println!("{:?}", err);
            Status::BadRequest
        }
    }
}

#[get("/watchers")]
pub fn get_all_watchers() -> Json<Vec<Watchers>> {
    match watchers::select_all_watchers() {
        Ok(watchers) => Json(watchers),
        Err(err) => {
            println!("{:?}", err);
            Json(vec![])
        }
    }
}
