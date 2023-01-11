#!/bin/bash

rm -rf ~/.regard_config
sudo rm -f /usr/local/bin/regard

sed -i 'nohup /\.regard_config\/server \& nohup \.regard_config\/watcher 120/d' ~/.bash_profile
