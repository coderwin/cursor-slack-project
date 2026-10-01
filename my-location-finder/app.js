const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const findBtn = document.getElementById("find-btn");
const retryBtn = document.getElementById("retry-btn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const accuracyEl = document.getElementById("accuracy");
const addressEl = document.getElementById("address");

let map = null;
let marker = null;

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status" + (type ? ` status--${type}` : "");
}

function geolocationErrorMessage(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "위치 권한이 거부되었습니다. 브라우저 설정에서 이 사이트의 위치 접근을 허용한 뒤 다시 시도하세요.";
    case error.POSITION_UNAVAILABLE:
      return "현재 위치를 확인할 수 없습니다. GPS·Wi-Fi 설정을 확인해 주세요.";
    case error.TIMEOUT:
      return "위치 요청 시간이 초과되었습니다. 다시 찾기를 눌러 주세요.";
    default:
      return "위치를 가져오는 중 오류가 발생했습니다.";
  }
}

function formatCoord(value) {
  return value.toFixed(6);
}

function ensureMap(lat, lng) {
  if (!map) {
    map = L.map("map").setView([lat, lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  } else {
    map.setView([lat, lng], 16);
  }

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }

  setTimeout(() => map.invalidateSize(), 0);
}

async function reverseGeocode(lat, lng) {
  addressEl.textContent = "주소 조회 중…";
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("accept-language", "ko");

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error("reverse geocode failed");
    }
    const data = await res.json();
    addressEl.textContent = data.display_name || "주소를 찾지 못했습니다.";
  } catch {
    addressEl.textContent =
      "주소를 가져오지 못했습니다. (네트워크 또는 API 제한)";
  }
}

function showPosition(position) {
  const { latitude, longitude, accuracy } = position.coords;

  latEl.textContent = formatCoord(latitude);
  lngEl.textContent = formatCoord(longitude);
  accuracyEl.textContent = `± ${Math.round(accuracy)} m`;

  resultsEl.hidden = false;
  ensureMap(latitude, longitude);
  void reverseGeocode(latitude, longitude);

  setStatus("위치를 찾았습니다.", "success");
  retryBtn.hidden = false;
}

function findLocation() {
  if (!("geolocation" in navigator)) {
    setStatus(
      "이 브라우저는 Geolocation API를 지원하지 않습니다.",
      "error",
    );
    return;
  }

  findBtn.disabled = true;
  retryBtn.disabled = true;
  setStatus("위치를 확인하는 중…");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      showPosition(position);
      findBtn.disabled = false;
      retryBtn.disabled = false;
    },
    (error) => {
      setStatus(geolocationErrorMessage(error), "error");
      findBtn.disabled = false;
      retryBtn.disabled = false;
      retryBtn.hidden = false;
    },
    GEO_OPTIONS,
  );
}

findBtn.addEventListener("click", findLocation);
retryBtn.addEventListener("click", findLocation);
