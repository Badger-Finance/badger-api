#!/bin/zsh

aws sts get-session-token --serial-number $1 --token-code $2 | cat
