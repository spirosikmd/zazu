#!/usr/bin/env bash

echo "process.env.ENV = 'production';" > ./src/env.ts

gulp package --env=production && electron-packager . Zazu --platform=darwin --arch=x64 --version=1.3.3 --overwrite \
    --ignore="node_modules|scripts|resources|.idea|src|.babelrc|.gitignore|.travis.yml|gulpfile.js|karma.conf.js|README.md|zazu.config.json|coverage|typings|tsconfig.json|typings.json"
