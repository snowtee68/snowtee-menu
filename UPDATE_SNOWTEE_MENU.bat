@echo off
chcp 65001 > nul
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0UPDATE_SNOWTEE_MENU.ps1"
echo.
echo After checking the result, use GitHub Desktop to Commit and Push.
pause
