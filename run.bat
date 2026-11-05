@echo off
TITLE LegalAI Platform Launcher
COLOR 0A
setlocal EnableDelayedExpansion

echo ===================================================
echo             LEGALAI PLATFORM LAUNCHER               
echo       Executive Intelligence ^& Judicial Portal      
echo ===================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/ before running LegalAI.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo [OK] Node.js detected: !NODE_VER!

:: 2. Check if server is already running on port 5000
netstat -ano | findstr /R /C:":5000 .*LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo [NOTICE] LegalAI Server is already active on port 5000!
    echo Opening browser to http://localhost:5000 ...
    start http://localhost:5000
    echo.
    echo Server is currently active in another window or background process.
    echo You can use LegalAI in your browser now.
    echo.
    pause
    exit /b 0
)

:: 3. Check and install backend dependencies
cd /d "%~dp0server"
if not exist node_modules (
    echo.
    echo [1/3] Installing npm dependencies in server folder...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Node.js server dependencies verified.
)

:: 4. Detect Python environment and launch ML service if present
echo [2/3] Checking Python Adaptive RAG ^& ML Engine...
set PYTHON_BIN=

if exist "%~dp0.venv\Scripts\python.exe" (
    "%~dp0.venv\Scripts\python.exe" --version >nul 2>nul
    if !errorlevel! equ 0 set PYTHON_BIN="%~dp0.venv\Scripts\python.exe"
)
if "!PYTHON_BIN!"=="" (
    python --version >nul 2>nul
    if !errorlevel! equ 0 set PYTHON_BIN=python
)
if "!PYTHON_BIN!"=="" (
    py --version >nul 2>nul
    if !errorlevel! equ 0 set PYTHON_BIN=py
)

if not "!PYTHON_BIN!"=="" (
    echo [OK] Starting Python ML Intelligence service on port 8000...
    start "LegalAI Python ML Service" /min cmd /c "cd /d \"%~dp0ml\" && !PYTHON_BIN! app.py"
) else (
    echo [INFO] Python ML service optional. Running full platform with built-in Node.js RAG ^& AI Intelligence Engine.
)

:: 5. Open browser automatically with safe delay
echo [3/3] Preparing automatic browser launch...
start "" cmd /c "powershell -NoProfile -Command Start-Sleep -Milliseconds 2200; Start-Process 'http://localhost:5000'"

:: 6. Launch Express Web & API Server
echo.
echo ===================================================
echo  LEGALAI PLATFORM IS RUNNING!
echo  Public Portal:      http://localhost:5000
echo  Advocates:          http://localhost:5000/lawyers.html
echo  Client Portal:      http://localhost:5000/user.html
echo  Admin Dashboard:    http://localhost:5000/admin.html
echo ===================================================
echo.
echo NOTE: KEEP THIS WINDOW OPEN while using LegalAI.
echo Press Ctrl+C to stop the server when you are done.
echo ---------------------------------------------------
echo.

node server.js

echo.
echo LegalAI Server has stopped.
pause
