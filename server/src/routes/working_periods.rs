use rocket::http::Status;
use rocket::response::status;
use rocket::serde::json::Json;

// import services module
use crate::services::working_periods;
use crate::services::working_periods::WorkingPeriods;

#[post("/working_periods/<name>", format = "json", data = "<working_periods>")]
pub fn new_working_periods(
    working_periods: Json<WorkingPeriods>,
    name: &str,
) -> Result<(), status::BadRequest<String>> {
    match working_periods::init_working_periods(&working_periods, name) {
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

#[get("/working_periods/<id>")]
pub fn get_by_wacher_id_working_periods(
    id: i64,
) -> Result<Json<Vec<WorkingPeriods>>, status::BadRequest<String>> {
    match working_periods::select_all_by_watcher_id_working_periods(id) {
        Ok(working_periods) => Ok(Json(working_periods)),
        Err(err) => {
            println!("{:?}", err);
            Err(status::BadRequest(Some(format!("{:?}", err))))
        }
    }
}

#[delete("/working_periods/<name>")]
pub fn delete_by_watcher_name_working_periods(
    name: &str,
) -> Result<(), status::BadRequest<String>> {
    match working_periods::delete_by_watcher_name_working_periods(name) {
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

#[delete("/working_periods")]
pub fn delete_all_working_periods() -> Result<(), status::BadRequest<String>> {
    match working_periods::delete_all_working_periods() {
        Ok(()) => Ok(()),
        Err(err) => Err(status::BadRequest(Some(format!("{:?}", err)))),
    }
}
