@echo off
chcp 65001 > nul
title بوتيك لندن للأزياء - نظام الكاشير والمحاسبة

echo ===================================================================
echo     بوتيك لندن للأزياء - نظام الكاشير والمحاسبة (وضع عدم الاتصال)
echo ===================================================================
echo.
echo   جاري تشغيل البرنامج كنافذة سطح مكتب مستقلة...
echo   (البرنامج يعمل 100%% بدون الحاجة لأي اتصال بالإنترنت)
echo.

set TARGET_FILE=%~dp0index.html

:: 1. Try Microsoft Edge in standalone App Mode (Standard on all Windows 10 & 11)
where msedge >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start "" msedge --app="file:///%TARGET_FILE%" --window-size=1440,900
    exit
)

:: 2. Try Google Chrome in standalone App Mode
where chrome >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start "" chrome --app="file:///%TARGET_FILE%" --window-size=1440,900
    exit
)

:: 3. Fallback to default browser
start "" "%TARGET_FILE%"
exit
