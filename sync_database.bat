@echo off
title VAJRA x SENTINA - Database Synchronization
echo ================================================================
echo   VAJRA x SENTINA - Database File Sync & Lock Resolver
echo ================================================================
echo.

cd /d "%~dp0"
python sync_sentinal_db.py

echo.
pause
