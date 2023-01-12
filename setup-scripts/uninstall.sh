#!/bin/bash

if [ "$1" == "true" ]; then
    echo -e "\033[32mUninstall starting !.\033[0m"
fi

rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

crontab -l >mycron
sed -i '/\.regard_config\/server.*&> \/dev\/null.*/d;/\.regard_config\/watcher.*&> \/dev\/null.*/d' mycron
crontab mycron
rm mycron

if [ "$1" == "true" ]; then
    echo -e "\033[32mUninstall done ! Reboot to remove everything. Bye !\033[0m"
fi
