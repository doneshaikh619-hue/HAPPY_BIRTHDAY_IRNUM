@echo off
title Push Irnum Birthday Website to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing Irnum's Birthday Tribute to GitHub...
echo Repository: https://github.com/doneshaikh619-hue/HAPPY_BIRTHDAY_IRNUM.git
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS! Website pushed to GitHub successfully!
    echo ========================================================
) else (
    echo ========================================================
    echo Push encountered an issue. Please verify your GitHub login.
    echo ========================================================
)
echo.
pause
