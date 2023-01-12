#!/bin/bash

unameOut="$(uname -s)"

if [ "${unameOut}" == "Linux" ]; then
    ~/.regard_config/regardGUI
elif [ "${unameOut}" == "Darwin"]; then
    open ~/.regard_config/regard.dmg
fi
