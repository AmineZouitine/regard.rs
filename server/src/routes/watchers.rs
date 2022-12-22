use rocket::response::status;
use rocket::serde::json::Json;

// import services module
use crate::services::watchers::{self, UpdateWatchers};
use crate::services::watchers::{select_by_name_watchers, Watchers};

#[post("/watchers", format = "json", data = "<watcher>")]
pub fn new_watcher(watcher: Json<Watchers>) -> Result<(), status::BadRequest<String>> {
    match watchers::init_watchers(&watcher) {
        Ok(()) => Ok(()),
        Err(err) => {
            let extended_error_code = err.sqlite_error_code().unwrap();
            if extended_error_code == rusqlite::ErrorCode::ConstraintViolation {
                let error_message = err.to_string();
                if error_message.contains("name") {
                    return Err(status::BadRequest(Some(format!(
                        "{:?} is already used. 'watcher_name' should be unique, you have to choose another one.", watcher.name
                    ))));
                }
                return Err(status::BadRequest(Some(format!(
                        "{:?} is already used. 'path_to_watch' should be unique, you have to choose another one.", watcher.path
                    ))));
            }
            Err(status::BadRequest(Some(format!("{:?}", err))))
        }
    }
}

#[get("/watchers")]
pub fn get_all_watchers() -> Result<Json<Vec<Watchers>>, status::BadRequest<String>> {
    match watchers::select_all_watchers() {
        Ok(watchers) => Ok(Json(watchers)),
        Err(err) => Err(status::BadRequest(Some(format!("{:?}", err)))),
    }
}

#[get("/watchers/active")]
pub fn get_all_active_watchers() -> Result<Json<Vec<Watchers>>, status::BadRequest<String>> {
    match watchers::select_all_active_watchers() {
        Ok(watchers) => Ok(Json(watchers)),
        Err(err) => Err(status::BadRequest(Some(format!("{:?}", err)))),
    }
}

#[patch("/watchers/<name>", format = "json", data = "<update_watcher>")]
pub fn patch_watcher(
    name: String,
    update_watcher: Json<UpdateWatchers>,
) -> Result<(), status::BadRequest<String>> {
    if let Err(err) = watchers::select_by_name_watchers(&name) {
        return match err {
            rusqlite::Error::QueryReturnedNoRows => Err(status::BadRequest(Some(format!(
                "The warcher name '{:?}' doesn't exist.",
                name
            )))),
            _ => Err(status::BadRequest(Some(format!("{:?}", err)))),
        };
    }

    match watchers::patch_watcher(&name, &update_watcher) {
        Ok(_) => Ok(()),
        Err(err) => {
            let extended_error_code = err.sqlite_error_code().unwrap();
            if extended_error_code == rusqlite::ErrorCode::ConstraintViolation {
                let error_message = err.to_string();
                if error_message.contains("name") {
                    return Err(status::BadRequest(Some(format!(
                        "{:?} is already used. 'watcher_name' should be unique, you have to choose another one.", &update_watcher.name.as_ref().unwrap()
                    ))));
                }
                return Err(status::BadRequest(Some(format!(
                        "{:?} is already used. 'path_to_watch' should be unique, you have to choose another one.", &update_watcher.path.as_ref().unwrap()
                    ))));
            }
            Err(status::BadRequest(Some(format!("{:?}", err))))
        }
    }
}

#[get("/watchers/<name>")]
pub fn get_by_name_watcher(name: String) -> Result<Json<Watchers>, status::BadRequest<String>> {
    match watchers::select_by_name_watchers(&name) {
        Ok(watchers) => Ok(Json(watchers)),
        Err(err) => match err {
            rusqlite::Error::QueryReturnedNoRows => Err(status::BadRequest(Some(format!(
                "The warcher name '{:?}' doesn't exist.",
                name
            )))),
            _ => Err(status::BadRequest(Some(format!("{:?}", err)))),
        },
    }
}

#[delete("/watchers/<name>")]
pub fn delete_by_name_watcher(name: String) -> Result<(), status::BadRequest<String>> {
    if let Err(err) = watchers::select_by_name_watchers(&name) {
        return match err {
            rusqlite::Error::QueryReturnedNoRows => Err(status::BadRequest(Some(format!(
                "The warcher name '{:?}' doesn't exist.",
                name
            )))),
            _ => Err(status::BadRequest(Some(format!("{:?}", err)))),
        };
    }
    match watchers::delete_by_name_watchers(&name) {
        Ok(()) => Ok(()),
        Err(err) => match err {
            rusqlite::Error::QueryReturnedNoRows => Err(status::BadRequest(Some(format!(
                "The warcher name '{:?}' doesn't exist.",
                name
            )))),
            _ => Err(status::BadRequest(Some(format!("{:?}", err)))),
        },
    }
}
