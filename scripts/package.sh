#!/usr/bin/env bash

gulp package --env=production && electron-packager . Zazu --platform=darwin --arch=x64 --version=0.37.3 --overwrite