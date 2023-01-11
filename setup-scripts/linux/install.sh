#!/bin/bash

chmod +x uninstall.sh
./uninstall.sh

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.AppImage regardGUI
mv regardGUI regard.deb watcher server ~/.regard_config

chmod +x regardGUI

~/.regard_config/server &
~/.regard_config/watcher 120

(
    crontab -l 2>/dev/null
    echo "@reboot ~/.regard_config/server & ~/.regard_config/watcher 120"
) | crontab -

rm install.sh
