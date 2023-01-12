#!/bin/bash

echo -e "\033[32mUninstall starting !.\033[0m"
rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

crontab -l >mycron
sed -i '/@reboot nohup \~\/.regard_config\/server \& nohup \~\/.regard_config\/watcher 120/d' mycron
crontab mycron
rm mycron
echo -e "\033[31mUninstall done ! Reboot to remove everything. Bye !\033[0m"
