@echo off
setlocal
cd /d "%~dp0"
echo.
echo ================================================
echo   PAPA BONSKI SUPER KIDS - EASY INSTALL V3
echo ================================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js belum terinstall.
  echo Install Node.js 20+ dari https://nodejs.org lalu jalankan file ini lagi.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto :error
call npm run setup
if errorlevel 1 goto :error
echo.
echo Setup awal selesai. Berikutnya jalankan RUN-PAPA-BONSKI-WINDOWS.bat
pause
exit /b 0
:error
echo.
echo Instalasi berhenti karena terjadi error. Baca pesan di atas.
pause
exit /b 1
