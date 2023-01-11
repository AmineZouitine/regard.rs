#!/bin/bash

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.AppImage regard.deb watcher server ~/.regard_config

(
    crontab -l 2>/dev/null
    echo "@reboot ~/.regard_config/server & ~/.regard_config/watcher 120"
) | crontab -
