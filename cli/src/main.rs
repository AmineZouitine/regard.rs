pub mod arguments_manager;
pub mod requests;
pub mod utils;
pub mod verification;
use std::process::Command;

use verification::{get_absolute_path, valid_name, valid_path};

use arguments_manager::ArgumentsManager;
use arguments_manager::Commands;
use clap::Parser;

#[tokio::main]
async fn main() {
    let arguments_manager = ArgumentsManager::parse();

    match &arguments_manager.command {
        Commands::Add {
            path_to_watch,
            watcher_name,
        } => {
            if valid_name(watcher_name) && valid_path(path_to_watch) {
                if let Ok(absolute_path) = get_absolute_path(path_to_watch) {
                    requests::add(&absolute_path, watcher_name).await;
                }
            }
        }
        Commands::Ls => requests::ls().await,
        Commands::Update {
            watcher_name,
            new_path,
        } => {
            if valid_name(watcher_name) && valid_path(new_path) {
                if let Ok(absolute_path) = get_absolute_path(new_path) {
                    requests::update(watcher_name, &absolute_path).await;
                }
            }
        }
        Commands::Start { watcher_name } => {
            if valid_name(watcher_name) {
                requests::start(watcher_name).await;
            }
        }
        Commands::Stop { watcher_name } => {
            if valid_name(watcher_name) {
                requests::stop(watcher_name).await;
            }
        }
        Commands::Remove { watcher_name } => {
            if valid_name(watcher_name) {
                requests::remove(watcher_name).await;
            }
        }
        Commands::RemoveAll => requests::remove_all().await,
        Commands::Rename {
            old_watcher_name,
            new_watcher_name,
        } => {
            if valid_name(old_watcher_name) && valid_name(new_watcher_name) {
                requests::rename(old_watcher_name, new_watcher_name).await;
            }
        }
        Commands::Reset { watcher_name } => {
            if valid_name(watcher_name) {
                requests::reset(watcher_name).await;
            }
        }
        Commands::ResetAll => requests::reset_all().await,
        Commands::Display => {
            Command::new("sh")
                .arg("~/.regard_config/openGUI.sh")
                .output()
                .expect("Error: Cannot open GUI, open an issue please.");
        }
        Commands::Uninstall => {
            Command::new("sh")
                .arg("~/.regard_config/unistall.sh")
                .output()
                .expect("Error: Error during the unistallation, open an issue please.");
        }
    };
}
