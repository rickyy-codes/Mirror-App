const locationLabel = document.querySelector(".location");

const timeDisplay = document.querySelector(".timeDisplay");
const dateDisplay = document.querySelector(".dateDisplay");
const dayDisplay = document.querySelector(".dayDisplay");

const descDisplay = document.querySelector(".descDisplay");
const tempDisplay = document.querySelector(".tempDisplay");
const humidityDisplay = document.querySelector(".humidityDisplay");
const windSpeedDisplay = document.querySelector(".windSpeedDisplay");

const weatherEmoji = document.querySelector(".weatherEmoji");

const aboutLabel = document.querySelector(".about");

const encodedKey = `N2JiNzQ3MzgzOTNkYjY3NmUzM2Q0NmFlMjZmYjUxYTU=`;
const apiKey = atob(encodedKey);

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation Not Supported"));
      return;
    }

    const options = {
      enableHighAccuracy: true, // Request higher accuracy
      timeout: 5000, // Set a timeout (in milliseconds)
      maximumAge: 0, // Don't use cached location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve([lat, lon]);
      },
      (error) => {
        console.error(error);
        reject(error);
        return;
      },
      options // Pass the options object
    );
  });
}

async function getWeatherData(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Could not Fetch Weather Data");
  }
  return await response.json();
}

function displayWeatherData(data) {
  console.log(data);
  const {
    name: city,
    main: { temp, humidity }, // kelvin
    weather: [{ description, id }],
    wind: { speed }, // m/sk
  } = data;

  formattedDesc = description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  locationLabel.textContent = city;
  descDisplay.textContent = formattedDesc;
  tempDisplay.textContent = `Temperature: ${Math.round(temp - 273.15)}°C`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  windSpeedDisplay.textContent = `Wind Speed: ${((speed * 18) / 5).toFixed(1)} km/h`;

  if (id > 199 && id < 300) weatherEmoji.textContent = "🌩️";
  if (id > 299 && id < 400) weatherEmoji.textContent = "🌦️";
  if (id > 499 && id < 600) weatherEmoji.textContent = "🌧️";
  if (id > 599 && id < 700) weatherEmoji.textContent = "❄️";
  if (id > 699 && id < 800) weatherEmoji.textContent = "🌫️";
  if (id === 800) weatherEmoji.textContent = "☀️";
  if (id > 800 && id < 900) weatherEmoji.textContent = "☁️";
}

async function updateWeatherData() {
  try {
    const coordinates = await getLocation(); // Wait for location

    if (!coordinates) {
      console.log("Could Not Retrieve Location");
      return;
    }

    const weatherData = await getWeatherData(coordinates);
    displayWeatherData(weatherData);
  } catch (error) {
    console.error(error);
  }
}

function updateDateAndTime() {
  const date = new Date();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  let meridian = "AM";
  if (hours > 12) {
    hours -= 12;
    meridian = "PM";
  }
  timeDisplay.textContent = `${hours}:${minutes} ${meridian}`;
  aboutLabel.textContent = `Made by Trishaan • Last Updated ${hours}:${minutes} ${meridian}`;

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  dateDisplay.textContent = `${day}-${month}-${year}`;

  const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = daysOfTheWeek[date.getDay()];
  dayDisplay.textContent = today;
}

updateDateAndTime();
updateWeatherData();

setInterval(() => {
  updateDateAndTime();
  updateWeatherData();
}, 60000);
