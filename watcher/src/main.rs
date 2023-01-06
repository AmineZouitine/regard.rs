pub mod requests;
use chrono::{DateTime, Local, TimeZone};
use std::env;
use std::fs;
use std::path::Path;
use std::process;
use std::thread;
use std::time::Duration;
use walkdir::WalkDir;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        println!("Usage: {} <seconds between checks>", args[0]);
        process::exit(1);
    }

    let seconds: u64 = match args[1].parse() {
        Ok(num) => num,
        Err(_) => {
            println!("Error: second argument must be a valid integer");
            process::exit(1);
        }
    };

    loop {
        let active_watchers = requests::get_active_watchers().await.unwrap();
        for watcher in active_watchers {
            if !Path::new(&watcher.path).exists() {
                requests::make_watcher_inactive(&watcher.name)
                    .await
                    .unwrap();
                continue;
            }

            let working_periods = requests::get_working_periods(watcher.id.unwrap())
                .await
                .unwrap();

            if working_periods.is_empty() {
                requests::new_working_periods(&watcher.name).await.unwrap();
                continue;
            }

            let last_update = &working_periods.last().unwrap().date;
            if is_older(Path::new(&watcher.path), last_update) {
                requests::new_working_periods(&watcher.name).await.unwrap();
            }
        }
        thread::sleep(Duration::from_secs(seconds));
    }
}

fn is_older(path: &Path, previous_modification: &str) -> bool {
    // Parse the previous modification string into a DateTime object
    let previous_modification_datetime: DateTime<Local> = Local
        .datetime_from_str(previous_modification, "%Y-%m-%dT%H:%M:%S%.f%z")
        .unwrap();

    // Recursively iterate over all the files and directories in the given path
    for entry in WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
        let entry_path = entry.path();

        // Get the metadata for the current file or directory
        let metadata = match fs::metadata(entry_path) {
            Ok(metadata) => metadata,
            Err(_) => continue, // Skip this entry if the metadata is not available
        };

        // Get the last modification time of the current file or directory as a DateTime object
        let last_modification_datetime = match metadata.modified() {
            Ok(system_time) => Local.timestamp_millis(
                system_time
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis() as i64,
            ),
            Err(_) => continue, // Skip this entry if the last modification time is not available
        };

        // Return true if the last modification time of the current file or directory is greater than the previous modification time
        if last_modification_datetime > previous_modification_datetime {
            return true;
        }
    }

    // Return false if no nested files or directories have a modification time greater than the previous modification time
    false
}
