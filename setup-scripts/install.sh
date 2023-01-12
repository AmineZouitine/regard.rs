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

chmod +x openGUI.sh
chmod a+w server

if [ "${unameOut}" == "Linux" ]; then
    mv regardGUI uninstall.sh openGUI.sh regard.deb watcher server ~/.regard_config
elif [ "${unameOut}" == "Darwin" ]; then
    mv regard.dmg openGUI.sh uninstall.sh watcher server ~/.regard_config
fi

sudo nohup ~/.regard_config/server &>/dev/null &
sudo nohup ~/.regard_config/watcher 120 &>/dev/null &

sleep 2

chmod a+w watch.db
mv watch.db ~/.regard_config/

(
    crontab -l 2>/dev/null
    echo "@reboot nohup ~/.regard_config/server &> /dev/null  & nohup ~/.regard_config/watcher 120 &> /dev/null"
) | crontab -

echo -e "\033[32mInstallation done ! Now you can use the 'regard' command.\033[0m"
