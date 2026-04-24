@echo off
REM EXW3 Local Site - Start Server
REM This script starts the Node.js development server

echo.
echo ========================================
echo     EXW3 Local Site Development Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Or use Python instead: python -m http.server 3003
    echo.
    pause
    exit /b 1
)

echo Starting server...
echo.
echo Opening http://localhost:3000 in your browser...
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
node "%~dp0server.js"

pause
