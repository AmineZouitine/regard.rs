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
pub fn get_all_watchers() -> Result<Json<Vec<Watchers>>, Status> {
    match watchers::select_all_watchers() {
        Ok(watchers) => Ok(Json(watchers)),
        Err(err) => {
            println!("{:?}", err);
            Err(Status::BadRequest)
        }
    }
}

#[get("/watchers/<name>")]
pub fn get_by_name_watcher(name: String) -> Result<Json<Watchers>, Status> {
    match watchers::select_by_name_watchers(Json(&name)) {
        Ok(watchers) => Ok(Json(watchers)),
        Err(err) => {
            println!("{:?}", err);
            Err(Status::BadRequest)
        }
    }
}
