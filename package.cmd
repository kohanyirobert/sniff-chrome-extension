del ..\*.crx
chrome --pack-extension=%cd%
dir .. | findstr crx
