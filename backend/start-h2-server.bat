@echo off
echo Starting H2 Database Server...
echo.
echo Server will run on: tcp://localhost:9092
echo Web Console will run on: http://localhost:8082
echo.

cd /d "%~dp0"
java -cp h2/bin/h2-2.2.224.jar org.h2.tools.Server -tcp -tcpAllowOthers -tcpPort 9092 -web -webAllowOthers -webPort 8082 -baseDir ./h2-data

pause
