@echo off
TITLE LegalAI Dataset Synchronizer
COLOR 0B
echo ===================================================
echo       LEGALAI DATASET SYNCHRONIZATION TOOL         
echo ===================================================
echo.
echo Synchronizing Indian Courts & Verified Advocates datasets...
echo.
cd /d "%~dp0"
node scripts/build_datasets.js
echo.
echo Done! All dataset files in datasets\ and ml\dataset\ are up to date.
echo.
pause

