#!/bin/bash

rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

sed -i '/\.regard_config\/server \& \.regard_config\/watcher 120/d' ~/.bash_profile
