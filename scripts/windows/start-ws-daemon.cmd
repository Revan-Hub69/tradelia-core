@echo off
setlocal

cd /d "%~dp0\\..\\.."
title Tradelia WS Daemon

npm run ws:daemon

endlocal

