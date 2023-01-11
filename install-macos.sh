#!/bin/bash

sudo mv regard /usr/local/bin

mkdir ~/.regard_config

mv regard.AppImage regard.deb watcher server ~/.regard_config

./server && ./watcher 120

echo '~/.regard_config/server & ~/.regard_config/watcher 120' >>~/.bash_profile
