#! /bin/sh
chrome --pack-extension=$(pwd)
ls -la | grep crx
