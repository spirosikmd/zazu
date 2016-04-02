#!/usr/bin/env bash

concurrently "npm run electron" "npm run dev"
