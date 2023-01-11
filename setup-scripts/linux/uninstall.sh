#!/bin/bash

rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

crontab -l >mycron
sed -i '/@reboot nohup \~\/.regard_config\/server \& nohup \~\/.regard_config\/watcher 120/d' mycron
crontab mycron
rm mycron
