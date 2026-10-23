@echo off
echo ========================================
echo   AI Feedback Management System
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend - Node.js" cmd /k "cd /d d:\OOSE\feedback\feedback\backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend React App...
start "Frontend - React" cmd /k "cd /d d:\OOSE\feedback\feedback\frontend && npm start"

echo.
echo ========================================
echo  Backend  : http://localhost:5000
echo  Frontend : http://localhost:3000
echo ========================================
echo.
pause
