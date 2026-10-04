let selectedLocation = "";
let currentLat = null;
let currentLon = null;

function setLocation(name, lat, lon) {
  selectedLocation = name;
  currentLat = Number(lat);
  currentLon = Number(lon);

  document.getElementById("locationBox").innerHTML =
    `<b>${escapeHtml(name)}</b><br>
     Latitude: ${currentLat.toFixed(5)} | Longitude: ${currentLon.toFixed(5)}`;

  document.getElementById("locationStatus").textContent =
    "Location detected successfully.";

  loadLiveAirQuality(currentLat, currentLon);
  getPlants();
}

function detectLocation() {
  const status = document.getElementById("locationStatus");

  if (!navigator.geolocation) {
    status.textContent =
      "Geolocation is not supported. Use manual location.";
    return;
  }

  status.textContent = "Requesting location permission...";

  navigator.geolocation.getCurrentPosition(
    async function (pos) {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {

        const url =
          `https://nominatim.openstreetmap.org/reverse` +
          `?format=jsonv2&lat=${lat}&lon=${lon}`;

        const response = await fetch(url, {
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Location service failed");
        }

        const data = await response.json();
        const address = data.address || {};

        const name =
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          address.state_district ||
          "Detected Area";

        setLocation(name, lat, lon);

      } catch (error) {

        setLocation(
          `Detected Area (${lat.toFixed(3)}, ${lon.toFixed(3)})`,
          lat,
          lon
        );
      }
    },

    function () {

      status.textContent =
        "Location permission failed/blocked. Please allow location access.";

    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}


/* =========================================
   MANUAL LOCATION
   ========================================= */

async function useManualLocation() {

  const value =
    document.getElementById("manualLocation").value.trim();

  if (!value) {
    alert("Enter a city or area name.");
    return;
  }

  document.getElementById("locationStatus").textContent =
    "Finding location...";

  try {

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2&limit=1&q=${encodeURIComponent(value)}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    const results = await response.json();

    if (!results.length) {
      throw new Error("Location not found");
    }

    const place = results[0];

    setLocation(
      place.display_name.split(",")[0],
      place.lat,
      place.lon
    );

  } catch (error) {

    document.getElementById("locationStatus").textContent =
      "Location not found. Try another area.";

  }
}


/* =========================================
   LIVE AIR QUALITY
   ========================================= */

async function loadLiveAirQuality(lat, lon) {

  const loading =
    document.getElementById("airLoading");

  const content =
    document.getElementById("airContent");

  const errorBox =
    document.getElementById("airError");

  loading.style.display = "block";
  loading.textContent =
    "Loading live air-quality data...";

  content.style.display = "none";
  errorBox.innerHTML = "";

  try {

    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${lat}` +
      `&longitude=${lon}` +
      `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Air quality API failed");
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error("No current data available");
    }

    const current = data.current;

    const pm25 = current.pm2_5;
    const pm10 = current.pm10;
    const co = current.carbon_monoxide;
    const no2 = current.nitrogen_dioxide;
    const so2 = current.sulphur_dioxide;
    const o3 = current.ozone;

    const aqi = calculateAQI(pm25);

    document.getElementById("aqiValue").textContent =
      aqi;

    document.getElementById("pm25").textContent =
      formatValue(pm25);

    document.getElementById("pm10").textContent =
      formatValue(pm10);

    document.getElementById("co").textContent =
      formatValue(co);

    document.getElementById("no2").textContent =
      formatValue(no2);

    document.getElementById("so2").textContent =
      formatValue(so2);

    document.getElementById("o3").textContent =
      formatValue(o3);

    const airStatus =
      getAirStatus(aqi);

    const statusElement =
      document.getElementById("airStatus");

    statusElement.textContent =
      airStatus.text;

    statusElement.className =
      "air-status " + airStatus.className;

    document.getElementById("updated").textContent =
      "Updated: " +
      new Date().toLocaleString();

    loading.style.display = "none";
    content.style.display = "block";

    updateSafety(aqi);

    /* Refresh every 10 minutes */

    setTimeout(function () {

      if (
        currentLat !== null &&
        currentLon !== null
      ) {

        loadLiveAirQuality(
          currentLat,
          currentLon
        );

      }

    }, 600000);

  } catch (error) {

    console.error(error);

    loading.style.display = "none";

    errorBox.innerHTML =
      `<div class="result danger">
        Unable to load live air-quality data.
        Please check your internet connection.
      </div>`;
  }
}


/* =========================================
   AQI CALCULATION
   ========================================= */

function calculateAQI(pm25) {

  if (
    pm25 === null ||
    pm25 === undefined ||
    isNaN(pm25)
  ) {
    return "--";
  }

  if (pm25 <= 12) {

    return Math.round(
      (50 / 12) * pm25
    );

  }

  if (pm25 <= 35.4) {

    return Math.round(
      50 +
      ((100 - 50) / (35.4 - 12)) *
      (pm25 - 12)
    );

  }

  if (pm25 <= 55.4) {

    return Math.round(
      100 +
      ((150 - 100) / (55.4 - 35.4)) *
      (pm25 - 35.4)
    );

  }

  if (pm25 <= 150.4) {

    return Math.round(
      150 +
      ((200 - 150) / (150.4 - 55.4)) *
      (pm25 - 55.4)
    );

  }

  if (pm25 <= 250.4) {

    return Math.round(
      200 +
      ((300 - 200) / (250.4 - 150.4)) *
      (pm25 - 150.4)
    );

  }

  return 301;
}


/* =========================================
   AIR STATUS
   ========================================= */

function getAirStatus(aqi) {

  if (aqi === "--") {

    return {
      text: "Data unavailable",
      className: "danger"
    };

  }

  if (aqi <= 50) {

    return {
      text: "GOOD — Air quality is normal.",
      className: "safe"
    };

  }

  if (aqi <= 100) {

    return {
      text: "MODERATE — Sensitive people should take care.",
      className: "moderate"
    };

  }

  if (aqi <= 150) {

    return {
      text: "UNHEALTHY FOR SENSITIVE GROUPS",
      className: "warning"
    };

  }

  if (aqi <= 200) {

    return {
      text: "UNHEALTHY — Reduce prolonged outdoor exposure.",
      className: "danger"
    };

  }

  return {
    text: "VERY UNHEALTHY — Avoid prolonged outdoor exposure.",
    className: "danger"
  };
}


/* =========================================
   SAFETY GUIDANCE
   ========================================= */

function updateSafety(aqi) {

  const safety =
    document.getElementById("safety");

  if (!safety) {
    return;
  }

  if (aqi <= 50) {

    safety.innerHTML =
      `<b>Recommended action:</b>
       Air quality is currently good.
       Normal outdoor activities are generally suitable.`;

  } else if (aqi <= 100) {

    safety.innerHTML =
      `<b>Recommended action:</b>
       Air quality is moderate.
       Sensitive individuals should reduce prolonged outdoor exposure.`;

  } else if (aqi <= 150) {

    safety.innerHTML =
      `<b>Recommended action:</b>
       Pollution is elevated.
       Sensitive individuals should limit prolonged outdoor activity.`;

  } else if (aqi <= 200) {

    safety.innerHTML =
      `<b>Recommended action:</b>
       Pollution is high.
       Reduce prolonged outdoor exposure and consider protective measures.`;

  } else {

    safety.innerHTML =
      `<b>Recommended action:</b>
       Pollution is very high.
       Avoid prolonged outdoor exposure and stay indoors where possible.`;
  }
}


/* =========================================
   PLANT RECOMMENDATIONS
   ========================================= */

async function getPlants() {

  if (!selectedLocation) {

    document.getElementById("plants").textContent =
      "Select a location first.";

    return;
  }

  try {

    const response = await fetch(
      `api/recommendations?location=${encodeURIComponent(selectedLocation)}`
    );

    if (!response.ok) {
      throw new Error("Plant API failed");
    }

    const plants = await response.json();

    document.getElementById("plants").innerHTML =
      plants.map(function (plant, index) {

        return `
          <div class="plant">
            <span>${index + 1}</span>
            ${escapeHtml(plant)}
          </div>
        `;

      }).join("");

  } catch (error) {

    document.getElementById("plants").textContent =
      "Unable to load plant recommendations.";

  }
}


/* =========================================
   HELPERS
   ========================================= */

function formatValue(value) {

  if (
    value === null ||
    value === undefined ||
    isNaN(value)
  ) {
    return "--";
  }

  return Number(value).toFixed(1);
}


function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    function (character) {

      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character];

    }
  );
}