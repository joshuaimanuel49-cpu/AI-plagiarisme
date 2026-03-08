@echo off
title AI Plagiarism Checker

cd /d %~dp0

echo Menjalankan Backend AI...
python app.py

start http://127.0.0.1:5000

pause
