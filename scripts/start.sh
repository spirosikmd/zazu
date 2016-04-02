#!/usr/bin/env bash

concurrently --kill-others \"npm run electron\" \"npm run dev\"
