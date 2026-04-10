@echo off
echo Starting H2 Console...
echo.
echo Console will open at: http://localhost:8082
echo.
echo Connection Settings:
echo   Driver Class: org.h2.Driver
echo   JDBC URL: jdbc:h2:tcp://localhost:9092/./h2-data/quickserv
echo   User Name: sa
echo   Password: (leave empty)
echo.

cd /d "%~dp0"
start http://localhost:8082
java -cp h2/bin/h2-2.2.224.jar org.h2.tools.Console -web -webAllowOthers -webPort 8082

pause
