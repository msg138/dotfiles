# Dotfiles

This is my implementation of dotfiles created using the beloved TypeScript.

## Getting Started

Basic prerequisites for running is having `git` and `node` installed.

1. Run `/bin/bash ./scripts/init.sh`

## Config

You can modify the config files in `./config` to suit your needs, as these are used for the file generation and environment setup.

### main.json

TODO Document. This file holds the main configuration for what gets generated.

## Scripts

To run the scripts, set your current working directory to `./core` before running the following

### bun run backup

Will create backups of dotfiles to be overwritten and save them to the `backupDirectory` as defined in `main.json`

### bun run create:all

Will perform all actions per the scripts below (which does not include backups)

### bun run create:dotfiles

Will create dotfiles.

### bun run create:directories

Will create directories (as specified in `main.json`)

### bun run create:git

Will clone git repos as per `main.json`

