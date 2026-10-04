<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AirGuard | Smart Environmental Safety</title>
<link rel="stylesheet" href="css/style.css">
</head>

<body>

<header>
  <div>
    <h1>🌱 AirGuard</h1>
    <p>Smart environmental monitoring & plant recommendation</p>
  </div>

  <span class="status-dot">● System Ready</span>
</header>

<main>

  <!-- AREA DETECTION -->
  <section class="card">

    <h2>📍 Area Detection</h2>

    <p id="locationStatus">
      Location not detected.
    </p>

    <div class="row">

      <button class="btn primary"
              onclick="detectLocation()">
        Detect Current Location
      </button>

      <input id="manualLocation"
             placeholder="Enter city / area manually">

      <button class="btn"
              onclick="useManualLocation()">
        Use Manual Location
      </button>

    </div>

    <div id="locationBox" class="result">
      No location selected.
    </div>

  </section>


  <!-- AIR QUALITY + PLANTS -->
  <section class="grid">


    <!-- LIVE AIR QUALITY -->
    <div class="card">

      <h2>🧪 Live Air / Pollution Level</h2>

      <div id="airLoading" class="loading">
        Waiting for live air-quality data...
      </div>


      <div id="airContent" style="display:none;">

        <div>
          Overall Air Quality
        </div>


        <div class="aqi-number" id="aqiValue">
          --
        </div>


        <div id="airStatus" class="air-status">
          --
        </div>


        <div class="pollutants">


          <div class="pollutant">
            <strong id="pm25">--</strong>
            <span>PM2.5 µg/m³</span>
          </div>


          <div class="pollutant">
            <strong id="pm10">--</strong>
            <span>PM10 µg/m³</span>
          </div>


          <div class="pollutant">
            <strong id="co">--</strong>
            <span>CO</span>
          </div>


          <div class="pollutant">
            <strong id="no2">--</strong>
            <span>NO₂</span>
          </div>


          <div class="pollutant">
            <strong id="so2">--</strong>
            <span>SO₂</span>
          </div>


          <div class="pollutant">
            <strong id="o3">--</strong>
            <span>O₃</span>
          </div>


        </div>


        <div class="last-updated" id="updated">
          --
        </div>

      </div>


      <div id="airError"></div>

    </div>


    <!-- SUITABLE PLANTS -->
    <div class="card">

      <h2>🌳 Suitable Plants</h2>

      <p>
        Recommendations are based on the detected area
        and current environmental conditions.
      </p>

      <button class="btn primary"
              onclick="getPlants()">
        Suggest Plants
      </button>

      <div id="plants" class="plant-list">
        Select a location first.
      </div>

    </div>

  </section>


  <!-- CURRENT SAFETY GUIDANCE -->
  <section class="card">

    <h2>⚠️ Current Safety Guidance</h2>

    <div id="safety" class="safety">
      Detect your location to generate current safety guidance.
    </div>

    <small>
      AirGuard uses available air-quality data for the detected
      location. For actual gas concentration from physical sensors,
      an IoT gas sensor can be connected in the future.
    </small>

  </section>

</main>


<script src="js/app.js"></script>

</body>
</html>