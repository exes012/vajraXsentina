@echo off
title VAJRA x SENTINA Unified Security Platform
echo ================================================================
echo   VAJRA x SENTINA - Unified Threat Intel & SecOps Platform
echo ================================================================
echo.
echo [1/2] Launching Next.js Unified Frontend (Port 3000)...
start "VAJRA x SENTINA Frontend" cmd /k "cd /d "%~dp0vajra Finl\indigo 2\indigo\new\INDIGO\frontend" && npm run dev"

echo [2/2] Launching Backend Services (Port 8000)...
start "VAJRA Backend" cmd /k "cd /d "%~dp0vajra Finl\indigo 2\indigo\new\INDIGO\backend" && py -3.11 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo ================================================================
echo   Platform URLs:
echo   - Unified Web App: http://localhost:3000
echo   - Login Portal:    http://localhost:3000/login
echo   - Backend API:     http://127.0.0.1:8000
echo   - Swagger Docs:    http://127.0.0.1:8000/docs
echo ================================================================
echo.
pause
