@echo off
chcp 65001 >nul
title Kafe Pro
cd /d "%~dp0"

rem ---------------------------------------------------------------
rem  Kafe Pro - Windows uchun ishga tushirish
rem  1) Serverni yoqadi (alohida kichik oynada)
rem  2) Kassani Chrome'da ochadi: chek oynasiz, darhol printerga chiqadi
rem  Ish stoliga yorliq (shortcut) qilib qo'ying.
rem ---------------------------------------------------------------

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js o'rnatilmagan.
  echo  https://nodejs.org saytidan "LTS" versiyani yuklab o'rnating,
  echo  keyin shu faylni qayta oching.
  echo.
  pause
  exit /b 1
)

rem Server allaqachon ishlayotgan bo'lsa qayta yoqmaymiz
powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:3000/api/public | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  start "Kafe Pro server (YOPMANG)" /min cmd /k node server.js
  timeout /t 3 /nobreak >nul
)

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
  start "" "%CHROME%" --kiosk-printing --app=http://localhost:3000 --user-data-dir="%LocalAppData%\KafePro\chrome" --no-first-run
) else (
  echo Google Chrome topilmadi - oddiy brauzerda ochilmoqda ^(chek oynasi chiqadi^).
  start "" http://localhost:3000
)
exit /b 0
