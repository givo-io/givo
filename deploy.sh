#!/bin/sh
git pull origin $1
git checkout $1
cp -r src $2
