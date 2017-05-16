#! /bin/sh
rm ../*.crx
chrome --pack-extension=$(pwd)
ls -la | grep crx
