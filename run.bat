@echo off
TITLE LegalAI SQLite Server Launcher
COLOR 0A

echo ===================================================
echo             LEGALAI SERVER LAUNCHER               
echo             (Powered by SQLite Storage)            
echo ===================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ before running this server.
    echo.
    pause
    exit /b 1
)

:: 2. Navigate to server folder
cd /d "%~dp0server"

:: 3. Check if server is already running on port 5000
netstat -ano | findstr /R /C:":5000 .*LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    echo [NOTICE] LegalAI Server is already running on port 5000!
    echo Launching browser to http://localhost:5000 ...
    start http://localhost:5000
    echo.
    echo Server is currently active in another window or process.
    echo You can use LegalAI in your browser now.
    echo.
    pause
    exit /b 0
)

:: 4. Check dependencies
echo [1/3] Checking Node.js dependencies...
if not exist node_modules (
    echo Installing dependencies in server folder...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies ready.
)
echo.

:: 5. Schedule automatic browser launch (safe 1.5 second delay)
echo [2/3] Preparing automatic browser opening...
start "" cmd /c "powershell -NoProfile -Command Start-Sleep -Milliseconds 1500; Start-Process 'http://localhost:5000'"

:: 6. Start Express backend server
echo [3/3] Starting LegalAI Server (SQLite)...
echo ---------------------------------------------------
echo Server API URL:  http://localhost:5000
echo Web App URL:     http://localhost:5000
echo Database:        SQLite (legalai.db)
echo.
echo NOTE: KEEP THIS WINDOW OPEN while using LegalAI.
echo Press Ctrl+C to stop the server when you are done.
echo ---------------------------------------------------
echo.

node server.js

echo.
echo Server has stopped.
pause
