use clap::Parser;

#[derive(Parser)]
#[clap(author = "Amine Zouitine", version, about)]
pub struct ArgumentsManager {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(clap::Subcommand)]
pub enum Commands {
    /// Add a watcher for the specified path.
    Add {
        path_to_watch: String,
        watcher_name: String,
    },
    /// Lists all the watchers
    Ls,
    /// Update the path of the specified watcher
    Update {
        watcher_name: String,
        new_path: String,
    },
    /// Starts a specific watcher specified by the "watcher_name"
    Start { watcher_name: String },
    /// Stops a specific watcher specified by the "watcher_name"
    Stop { watcher_name: String },
    /// Removes a watcher for the specified by the "watcher_name"
    Remove { watcher_name: String },
    /// Removes all watchers
    RemoveAll,
    /// Renames a watcher. The "old_name" argument specifies the current name of the watcher, and the "new_name" argument specifies the new name for the watcher.
    Rename {
        old_watcher_name: String,
        new_watcher_name: String,
    },
    /// Resets a specific watcher specified by the "watcher_name"
    Reset { watcher_name: String },
    /// Resets all watchers
    ResetAll,
    /// Open a desktop application and display information about each watchers
    Display,

    /// Unistall regard
    Uninstall,
}
