// Search location json:
// `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=15.848640,%20121.539429`

// Weather forecast json:
// `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=15.848640,%20121.539429`

// Variables
const apiKey = "ce575a0024814263b35231641241805";

// Elements
const searchLocationInput = document.querySelector(".search-location-input");
const searchLocationBtn = document.querySelector(".search-location-btn");

const currentTemp = document.querySelectorAll(".current_temp span");
const feelsLikeTemp = document.querySelector(".feels-like-temp");
const countryName = document.querySelector(".country_name");
const currentLocation = document.querySelector(".current_location");
const currentWeatherIcon = document.querySelector(
  ".current-weather-icon-container > i"
);
const currentTime = document.querySelector(".current-time span");
const humidity = document.querySelector(".humidity span");
const wind = document.querySelector(".wind span");

const d = new Date();
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function searchLocation() {
  try {
    if (searchLocationInput.value === "") {
      throw new Error("Location field is blank");
    } else {
      const res = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchLocationInput.value}`
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      } else {
        const data = await res.json();
        console.log(data);
        getCurrentDataJson(data[0].name);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Functions
async function getCurrentDataJson(location) {
  try {
    const res = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    } else {
      const data = await res.json();

      // Get Current and Location data from API
      const current = data.current;
      const locationData = data.location;

      // Get current weather icon code
      const codeIcon = current.condition.code;

      let iconClass = "";
      switch (codeIcon) {
        case 1000:
          iconClass = "wi-day-sunny";
          break;
        case 1003:
          iconClass = "wi-day-cloudy";
          break;
        case 1006:
          iconClass = "wi-cloudy";
          break;
        case 1009:
          iconClass = "wi-day-sunny-overcast";
          break;
        case 1030:
          iconClass = "wi-fog";
          break;
        case 1063:
          iconClass = "wi-rain";
          break;
        case 1069:
          iconClass = "wi-sleet";
          break;
        case 1072:
          iconClass = "wi-sleet";
          break;
        default:
          console.error(
            `Error: IconCode ${codeIcon} not found in weather icons.`
          );
      }

      const currentWeatherClass = currentWeatherIcon.classList;

      currentWeatherClass.remove(currentWeatherClass[1]);
      currentWeatherClass.add(iconClass);
      console.log(codeIcon);
      // currentWeatherIcon.classList[1] = iconClass;

      // Country Name and Location
      countryName.textContent = locationData.country;
      currentLocation.textContent = locationData.name;

      // Current Temparature
      currentTemp.forEach((temp) => (temp.textContent = current.temp_c));

      // Feels like, Humidity and Wind
      feelsLikeTemp.textContent = current.feelslike_c;
      humidity.textContent = current.humidity;
      wind.textContent = current.wind_kph;

      // Current Time
      let currentTimeStr = "";
      const getCurrentDay = dayNames[d.getDay()];
      let hourAndMin = d.toLocaleTimeString().split(":");
      const getAMPM = d.toLocaleTimeString().split(":")[2].split(" ")[1];
      hourAndMin.pop();

      hourAndMin = `${hourAndMin.join(":")} ${getAMPM}`;
      currentTimeStr = `${getCurrentDay}, ${hourAndMin}`;
      currentTime.textContent = currentTimeStr;
    }
  } catch (error) {
    console.error(error);
  }
}

// Events
searchLocationBtn.addEventListener("click", searchLocation);
