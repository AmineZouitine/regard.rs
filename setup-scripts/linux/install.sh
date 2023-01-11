#!/bin/bash

chmod +x uninstall.sh
./uninstall.sh

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.AppImage regardGUI
chmod +x openGUI.sh
chmod +x regardGUI

mv regardGUI openGUI.sh regard.deb watcher server ~/.regard_config

nohup ~/.regard_config/server &
nohup ~/.regard_config/watcher 120 &

(
    crontab -l 2>/dev/null
    echo "@reboot nohup ~/.regard_config/server & nohup ~/.regard_config/watcher 120"
) | crontab -

rm install.sh
