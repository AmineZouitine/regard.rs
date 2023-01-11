#!/bin/bash

rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

crontab -l >mycron
sed -i '/@reboot \~\/.regard_config\/server \& \~\/.regard_config\/watcher 120/d' mycron
crontab mycron
rm mycron
