#!/bin/bash


# Get the full path of the script
this_path="$(readlink -f "$0")"

# Extract the directory part of the path
this_directory="$(dirname "$this_path")"
echo $this_path
echo $this_directory

/bin/bash "$this_directory/assert-node-version.sh"
if [ $? -eq 1 ]; then
  echo "Failed init."
  exit 1
fi

/bin/bash "$this_directory/assert-bun-version.sh"
if [ $? -eq 1 ]; then
  /bin/bash "$this_directory/install-bun.sh"
fi

/bin/bash "$this_directory/assert-bun-version.sh"
if [ $? -eq 1 ]; then
  echo "Failed init."
  exit 1
fi

set -e

/bin/bash "$this_directory/install-rust.sh"
/bin/bash "$this_directory/install-ripgrep.sh"
/bin/bash "$this_directory/install-git-delta.sh"
