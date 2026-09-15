@echo off
echo =========================================
echo 📦 VAJRA x SENTINA - Sync to GitHub ^& Render
echo =========================================

git add -A
git commit -m "update: sync project changes %date% %time%"
echo 🚀 Pushing to GitHub (origin main)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ [SUCCESS] Changes pushed to GitHub: https://github.com/exes012/vajraXsentina
    echo ⚡ Render will automatically deploy!
) else (
    echo.
    echo ❌ Push failed. Please check your GitHub credentials.
)
pause
