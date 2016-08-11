#!/usr/bin/env bash

echo "process.env.ENV = 'development';" > ./src/env.ts

karma start
