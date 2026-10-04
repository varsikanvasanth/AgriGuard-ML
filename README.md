# AirGuard - Working Browser Dashboard

## What is included
- Current browser location detection using Geolocation API.
- Reverse location name lookup using OpenStreetMap Nominatim.
- Manual location fallback.
- Gas percentage input and risk classification.
- Safety guidance based on gas level.
- Area-based plant recommendation.
- Tomcat/Maven WAR structure.

## Run
1. Install JDK 11+ and Maven. This version targets Tomcat 10.1.x (Jakarta Servlet 6).
2. In this folder run: `mvn clean package`
3. Copy `target/AirGuard-Full.war` to Tomcat `webapps`.
4. Start Tomcat.
5. Open: `http://localhost:8080/AirGuard-Full/`

## Important
The gas percentage slider is a demo/simulation input. A normal browser cannot physically measure gas concentration. For actual IoT measurement, connect a sensor/API and replace the slider value with the sensor reading.

## Windows quick run
From the project folder: `set "TOMCAT_HOME=C:\path\to\apache-tomcat-10.1.60"` then `scripts\run-tomcat.bat`.
