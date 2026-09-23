@echo off
title Rice Store POS & GCash Bridge Launcher
echo ===================================================
echo   NAGSISIMULA NA ANG STORE POS SYSTEM AT BRIDGE...
echo ===================================================

:: 1. Patakbuhin ang Node.js Server sa background
start /min cmd /c "node server.js"

:: 2. Mag-antay ng 2 segundo para siguradong gising na ang server
timeout /t 2 /nobreak >nul

:: 3. Awtomatikong buksan ang HTML POS sa iyong default browser (Google Chrome / Edge)
start "" "%~dp0index.html"

echo.
echo SUCCESS! Gumagana na ang Bridge Server at nakatabi sa Taskbar.
echo Huwag isasara ang window na ito habang bukas ang store.