use colored::*;
use regex::Regex;
use std::fs;
use std::path::Path;

pub fn valid_path(path: &str) -> bool {
    if !Path::new(path).exists() {
        println!(
            "{}: {} doesn't exists. You have to provide a valid path.",
            "Error".red().bold(),
            path
        );
        false
    } else {
        true
    }
}

pub fn valid_name(watcher_name: &str) -> bool {
    let valid_watcher_name = Regex::new(r"^([A-Z-a-z]+[1-9]*(_?[A-Z-a-z]+[1-9]*)*)+$").unwrap();
    if !valid_watcher_name.is_match(watcher_name) {
        println!(
            "{}: {} is not valid path name. Valid path name need to be match this regex {}",
            "Error".red().bold(),
            watcher_name,
            "^([A-Z-a-z]+[1-9]*(_?[A-Z-a-z]+[1-9]*)*)+$".green().bold()
        );
        false
    } else {
        true
    }
}

pub fn get_absolute_path(path: &String) -> Result<String, ()> {
    match fs::canonicalize(path) {
        Ok(absolute_path) => Ok(absolute_path.to_str().unwrap().to_string()),
        Err(_) => {
            println!("{}: try to use an absolute path.", "Error".red().bold());
            Err(())
        }
    }
}
