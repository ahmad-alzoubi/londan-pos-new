@echo off
chcp 65001 > nul
title بوتيك لندن للأزياء - إنشاء اختصار سطح المكتب

echo ===================================================================
echo     بوتيك لندن للأزياء - إنشاء اختصار البرنامج على سطح المكتب
echo ===================================================================
echo.

set SCRIPT="%TEMP%\create_londan_pos_shortcut.vbs"
set TARGET=%~dp0تشغيل_البرنامج_على_الويندوز.bat
set SHORTCUT=%USERPROFILE%\Desktop\بوتيك لندن للأزياء.lnk

echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%SHORTCUT%" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%TARGET%" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "نظام الكاشير والمحاسبة الذكي لبوتيك لندن للأزياء" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo [✓] تم إنشاء أيقونة واختصار البرنامج بنجاح على سطح المكتب!
echo     يمكنك الآن تشغيل البرنامج مباشرة من سطح المكتب في أي وقت بدون إنترنت.
echo.
pause
