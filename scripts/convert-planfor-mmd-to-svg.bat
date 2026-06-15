@echo off
setlocal enabledelayedexpansion

rem Convert every Mermaid .mmd file in "planfor app" to an SVG with the same base name.
rem Requires Node.js/npm. Mermaid CLI is downloaded temporarily through npx if not installed.

set "SOURCE_DIR=%~dp0..\planfor app"

if not exist "%SOURCE_DIR%" (
  echo ERROR: Source folder not found: "%SOURCE_DIR%"
  exit /b 1
)

set "FOUND=0"

for %%F in ("%SOURCE_DIR%\*.mmd") do (
  set "FOUND=1"
  echo Converting: %%~nxF
  call npx --yes @mermaid-js/mermaid-cli -i "%%~fF" -o "%%~dpnF.svg"
  if errorlevel 1 (
    echo ERROR: Failed to convert "%%~fF"
    exit /b 1
  )
)

if "%FOUND%"=="0" (
  echo No .mmd files found in "%SOURCE_DIR%".
) else (
  echo Done. SVG files were created next to the .mmd files in "%SOURCE_DIR%".
)

endlocal