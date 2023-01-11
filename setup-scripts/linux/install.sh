#!/bin/bash

chmod +x uninstall.sh
./uninstall.sh

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.AppImage regardGUI
chmod +x openGUI.sh
chmod +x regardGUI

mv regardGUI uninstall.sh openGUI.sh regard.deb watcher server ~/.regard_config

nohup ~/.regard_config/server &
nohup ~/.regard_config/watcher 120 &

mv *.db ~/.regard_config/
mv *.out ~/nohup.out

(
    crontab -l 2>/dev/null
    echo "@reboot nohup ~/.regard_config/server & nohup ~/.regard_config/watcher 120"
) | crontab -

