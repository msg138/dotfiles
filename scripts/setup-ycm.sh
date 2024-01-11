#!/bin/bash

# Assuming Debian 12 (my preferred OS)
sudo apt install -y build-essential cmake python3-dev

# This is due to running on a very low power devbox
export YCM_CORES=1

# This also makes an assumption about the location of cache directory.
# If you change main.json -> cacheDirectory, then update this
cd ~/.dotfile-cache/.vim/pack/vendor/start/YouCompleteMe
git submodule update --init --recursive
python3 install.py --ts-completer --verbose

