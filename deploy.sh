#!/bin/sh
# usage: ./deploy.sh pure_js www/public_html/app
git pull origin $1
git checkout $1
cp -r src/* $2
