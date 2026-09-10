@echo off
echo ===================================================
echo   Starting VAJRA Platform (Backend + Frontend)
echo ===================================================

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "VAJRA Backend (Port 8000)" cmd /k "cd /d "%~dp0indigo 2\indigo\new\INDIGO\backend" && py -3.11 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Next.js Frontend on http://localhost:3000 ...
start "VAJRA Frontend (Port 3000)" cmd /k "cd /d "%~dp0indigo 2\indigo\new\INDIGO\frontend" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend:  http://127.0.0.1:8000
echo - API Docs: http://127.0.0.1:8000/docs
pause
