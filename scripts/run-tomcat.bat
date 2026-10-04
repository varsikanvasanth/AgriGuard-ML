@echo off
setlocal
title AirGuard - Build and Run

echo ========================================
echo        AIRGUARD - BUILD ^& RUN
echo ========================================

cd /d "%~dp0.."

where mvn >nul 2>nul
if errorlevel 1 (
  echo ERROR: Maven is not installed or not in PATH.
  echo Install Maven, then reopen PowerShell.
  pause
  exit /b 1
)

if not defined JAVA_HOME (
  echo JAVA_HOME is not set. Trying to detect Java...
  for /f "delims=" %%J in ('where java 2^>nul') do (
    set "JAVA_EXE=%%J"
    goto :foundjava
  )
  echo ERROR: Java was not found.
  pause
  exit /b 1
)
goto :build

:foundjava
for %%A in ("%JAVA_EXE%") do set "JAVA_BIN=%%~dpA"
for %%A in ("%JAVA_BIN%..") do set "JAVA_HOME=%%~fA"

:build
echo JAVA_HOME=%JAVA_HOME%
echo.
echo Building AirGuard...
call mvn clean package
if errorlevel 1 (
  echo.
  echo BUILD FAILED.
  pause
  exit /b 1
)

echo.
echo Build successful: target\AirGuard-Full.war
echo.

if defined TOMCAT_HOME goto :tomcat

echo TOMCAT_HOME is not set.
echo Example:
echo   set "TOMCAT_HOME=C:\apache-tomcat-10.1.60"
echo   scripts\run-tomcat.bat
echo.
set /p TOMCAT_HOME=Enter your Tomcat folder path (or press Enter to stop): 
if "%TOMCAT_HOME%"=="" exit /b 0

:tomcat
if not exist "%TOMCAT_HOME%\bin\startup.bat" (
  echo ERROR: Tomcat not found at:
  echo %TOMCAT_HOME%
  pause
  exit /b 1
)

echo Copying WAR to Tomcat...
copy /Y "target\AirGuard-Full.war" "%TOMCAT_HOME%\webapps\AirGuard-Full.war" >nul
if errorlevel 1 (
  echo ERROR: Could not copy WAR. Check Tomcat permissions.
  pause
  exit /b 1
)

echo Starting Tomcat...
call "%TOMCAT_HOME%\bin\startup.bat"

echo.
echo ========================================
echo AirGuard should open at:
echo http://localhost:8080/AirGuard-Full/
echo ========================================
pause
