@echo off
chcp 65001 >nul
echo ========================================
echo   人生相册构建脚本
echo ========================================
echo.

cd /d "%~dp0.."

python scripts\generate-photos-json.py

echo.
echo ========================================
pause
