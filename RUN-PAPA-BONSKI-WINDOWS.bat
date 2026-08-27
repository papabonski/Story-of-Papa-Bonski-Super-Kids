@echo off
cd /d "%~dp0"
echo Papa Bonski Super Kids berjalan di http://localhost:3000
start "" http://localhost:3000/owner
call npm run dev
