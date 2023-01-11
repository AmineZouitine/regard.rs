#!/bin/bash

chmod +x uninstall.sh
./uninstall.sh

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.dmg watcher server ~/.regard_config

~/.regard_config/server &
~/.regard_config/watcher 120

echo '~/.regard_config/server & ~/.regard_config/watcher 120' >>~/.bash_profile
