#!/usr/bin/env bash

gulp package --env=production && electron-packager . Zazu --platform=darwin --arch=x64 --version=0.37.3 --overwrite \
    --ignore="node_modules|scripts|resources|.idea|src|.babelrc|.gitignore|.travis.yml|gulpfile.js|karma.conf.js|README.md|zazu.config.json"
