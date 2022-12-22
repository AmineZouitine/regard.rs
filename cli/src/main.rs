pub mod arguments_manager;
pub mod requests;

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
            requests::add(path_to_watch, watcher_name).await;
        }
        Commands::Ls => {}
        Commands::Update {
            watcher_name,
            new_path,
        } => {}
        Commands::Start { watcher_name } => {}
        Commands::Stop { watcher_name } => {}
        Commands::Remove { watcher_name } => {}
        Commands::RemoveAll => {}
        Commands::Rename {
            old_watcher_name,
            new_watcher_name,
        } => {}
        Commands::Reset { watcher_name } => {}
        Commands::ResetAll => {}
        Commands::Display => {}
    }
}
