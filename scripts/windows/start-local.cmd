@echo off
setlocal

REM Starts Tradelia local stack (Windows):
REM - WS daemon (Binance WS snapshot on 127.0.0.1:8787)
REM - Next dev server (dashboard on http://localhost:3000)

cd /d "%~dp0\\..\\.."

start "Tradelia WS Daemon" cmd /k npm run ws:daemon
start "Tradelia Next Dev" cmd /k npm run dev

echo Started. Open http://localhost:3000/dashboard/trading
endlocal

