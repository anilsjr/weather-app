const apikey = "0ca586ad6024c536c2328175d756a921";

const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");
const suggestionsEl = document.getElementById("suggestions");

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value;
  getWeatherData(cityValue);
  saveCity(cityValue);
  displaySavedCities();
});

cityInputEl.addEventListener("input", () => {
  const query = cityInputEl.value;
  if (query) {
    showSuggestions(query);
  } else {
    clearSuggestions();
  }
});

async function getWeatherData(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const details = [
      `Feels like: ${Math.round(data.main.feels_like)}`,
      `Humidity: ${data.main.humidity}%`,
      `Wind speed: ${data.wind.speed} m/s`,
    ];

    weatherDataEl.querySelector(
      ".icon"
    ).innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
    weatherDataEl.querySelector(
      ".temperature"
    ).textContent = `${temperature}°C`;
    weatherDataEl.querySelector(".description").textContent = description;

    weatherDataEl.querySelector(".details").innerHTML = details
      .map((detail) => `<div>${detail}</div>`)
      .join("");
  } catch (error) {
    weatherDataEl.querySelector(".icon").innerHTML = "";
    weatherDataEl.querySelector(".temperature").textContent = "";
    weatherDataEl.querySelector(".description").textContent =
      "An error happened, please try again later";
    weatherDataEl.querySelector(".details").innerHTML = "";
  }
}

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(cities));
  }
}

function displaySavedCities() {
  const cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  suggestionsEl.innerHTML = "";
  cities.forEach((city) => {
    const cityElement = document.createElement("a");
    cityElement.className = "list-group-item list-group-item-action";
    cityElement.textContent = city;
    cityElement.addEventListener("click", () => {
      getWeatherData(city);
    });

    // Create a remove button
    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger btn-sm";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the cityElement click event
      removeCity(city);
      displaySavedCities(); // Refresh the list after removing the city
    });

    // Append the remove button to the city element
    cityElement.appendChild(removeButton);
    suggestionsEl.appendChild(cityElement);
  });
}

function removeCity(city) {
  let cities = JSON.parse(localStorage.getItem("savedCities")) || [];
  cities = cities.filter((savedCity) => savedCity !== city);
  localStorage.setItem("savedCities", JSON.stringify(cities));
}

function showSuggestions(query) {
  // Implement a function to fetch and display city suggestions based on the query
}

function clearSuggestions() {
  suggestionsEl.innerHTML = "";
}

// Initialize saved cities on page load
document.addEventListener("DOMContentLoaded", displaySavedCities);
