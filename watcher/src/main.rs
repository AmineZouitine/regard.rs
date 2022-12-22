use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
pub mod requests;

#[tokio::main]
async fn main() {
    // let paths = match requests::get_watchers().await {
    //     Ok(paths) => paths,
    //     Err(err) => panic!("{:?}", err),
    // };
    let paths = vec!["oui.txt".to_string()];
    watch(&paths).await.unwrap();
}

async fn watch(paths: &[String]) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default())?;
    for path in paths {
        watcher.watch(Path::new(path), RecursiveMode::Recursive)?;
    }

    for res in rx {
        match res {
            Ok(event) => {
                if let EventKind::Access(_) = event.kind {
                    println!("Modification");

                    for path in paths {
                        watcher.unwatch(Path::new(path)).unwrap();
                    }
                    let watchers_to_watch = requests::get_watchers().await.unwrap();
                    for watcher_to_watch in watchers_to_watch {
                        watcher
                            .watch(Path::new(&watcher_to_watch.path), RecursiveMode::Recursive)
                            .unwrap();
                    }
                }
            }
            Err(e) => println!("watch error: {:?}", e),
        }
    }

    Ok(())
}
