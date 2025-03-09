#!/bin/sh
set -e

BLDIR=dist/firefox
rm -rf $BLDIR/*

echo "Starting build"

cp -R src/* $BLDIR # Seperate this later
cp platform/firefox/*.json $BLDIR

pushd $BLDIR

zip -r firefox.zip ./* 

popd 