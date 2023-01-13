#!/bin/bash

chmod +x uninstall.sh
./uninstall.sh false

echo -e "\033[32mInstallation starting !.\033[0m"
unameOut="$(uname -s)"

sudo mv regard /usr/local/bin
mkdir ~/.regard_config

if [ "${unameOut}" == "Linux" ]; then
    mv regard.AppImage regardGUI
    chmod +x regardGUI
fi

if [ "${unameOut}" == "Linux" ]; then
    mv regardGUI uninstall.sh openGUI.sh regard.deb watcher server ~/.regard_config
elif [ "${unameOut}" == "Darwin" ]; then
    mv regard.dmg openGUI.sh uninstall.sh watcher server ~/.regard_config
fi

chmod a+x ~/.regard_config/server
chmod a+x ~/.regard_config/watcher

chmod a+w ~/.regard_config/server
chmod a+w ~/.regard_config/watcher

nohup ~/.regard_config/server &>/dev/null &
nohup ~/.regard_config/watcher 120 &>/dev/null &

sleep 2

mv watch.db ~/.regard_config/

(
    crontab -l 2>/dev/null
    echo "@reboot nohup ~/.regard_config/server &> /dev/null  & nohup ~/.regard_config/watcher 120 &> /dev/null"
) | crontab -

echo -e "\033[32mInstallation done ! Now you can use the 'regard' command.\033[0m"
