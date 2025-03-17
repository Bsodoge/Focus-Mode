#!/bin/sh
set -e

BLDIR=dist/chrome
rm -rf $BLDIR/*

echo "Starting build"

cp -R src/* $BLDIR # Seperate this later
cp platform/chrome/*.json $BLDIR

pushd $BLDIR

zip -r chrome.zip ./* 

popd 