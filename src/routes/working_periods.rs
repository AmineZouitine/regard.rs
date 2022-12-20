use rocket::http::Status;
use rocket::serde::json::Json;

// import services module
use crate::services::working_periods;
use crate::services::working_periods::WorkingPeriods;

#[post("/working_periods/<name>", format = "json", data = "<working_periods>")]
pub fn new_working_periods(
    working_periods: Json<WorkingPeriods>,
    name: &str,
) -> Result<(), Status> {
    match working_periods::init_working_periods(&working_periods, name) {
        Ok(()) => Ok(()),
        Err(err) => {
            println!("{:?}", err);
            Err(Status::BadRequest)
        }
    }
}

#[get("/working_periods/<id>")]
pub fn get_by_wacher_id_working_periods(id: i64) -> Result<Json<Vec<WorkingPeriods>>, Status> {
    match working_periods::select_all_by_watcher_id_working_periods(id) {
        Ok(working_periods) => Ok(Json(working_periods)),
        Err(err) => {
            println!("{:?}", err);
            Err(Status::BadRequest)
        }
    }
}
