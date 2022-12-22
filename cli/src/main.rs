pub mod arguments_manager;
pub mod requests;
pub mod utils;

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
        } => requests::add(path_to_watch, watcher_name).await,
        Commands::Ls => requests::ls().await,
        Commands::Update {
            watcher_name,
            new_path,
        } => requests::update(watcher_name, new_path).await,
        Commands::Start { watcher_name } => requests::start(watcher_name).await,
        Commands::Stop { watcher_name } => requests::stop(watcher_name).await,
        Commands::Remove { watcher_name } => requests::remove(watcher_name).await,
        Commands::RemoveAll => requests::remove_all().await,
        Commands::Rename {
            old_watcher_name,
            new_watcher_name,
        } => requests::rename(old_watcher_name, new_watcher_name).await,
        Commands::Reset { watcher_name } => requests::reset(watcher_name).await,
        Commands::ResetAll => requests::reset_all().await,
        Commands::Display => {}
    };
}
