import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  // State variables to store weather data, user input, location, dark mode status, and multiple cities
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Delhi');
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [cities, setCities] = useState([
    { name: 'Delhi', data: null },
    { name: 'Mumbai', data: null },
    { name: 'Dehradun', data: null },
    { name: 'Paris', data: null },
    { name: 'Chicago', data: null },
    { name: 'London', data: null },
    { name: 'New York', data: null },
    { name: 'Tokyo', data: null },
    { name: 'California', data: null },
    { name: 'Rome', data: null },
  ]);

  const apiKey = 'ecc4f31f4c9bc45a5b421e686d1d3f14';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  // Fetch weather data for a single city
  const fetchWeatherData = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.json();
  };

  // Fetch weather data for all cities when the component mounts
  useEffect(() => {
    const fetchCitiesWeather = async () => {
      const updatedCities = await Promise.all(
        cities.map(async (city) => {
          const data = await fetchWeatherData(city.name);
          return { ...city, data };
        })
      );
      setCities(updatedCities);
    };

    fetchCitiesWeather();
  }, []);

  // Fetch weather data when the location changes
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error fetching the weather data:', error));
  }, [url]);

  // Handle search button click
  const handleSearch = async () => {
    if (!query) return;
    const data = await fetchWeatherData(query);
    if (data.cod === 200) {
      const newCity = { name: query, data };
      const newCities = [newCity, ...cities.slice(0, 9)]; // Add new city to the top and remove the last city if the list exceeds 7
      setCities(newCities);
      setLocation(query);
      setQuery('');
    } else {
      alert(data.message);
    }
  };

  // Toggle between dark mode and light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get the current time in the format HH:MM:SS
  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Display loading message until weather data is fetched
  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="left-panel">
        <div className="city-list">
          {cities.map((city, index) => (
            <div key={index} className="city-item">
              <p>{city.name}</p>
              {city.data && (
                <div className="city-weather">
                  <p>{Math.round(city.data.main.temp)}°C</p>
                  <p>{city.data.weather[0].description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="city-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city or zip code"
          />
          <button onClick={handleSearch}>Add City</button>
        </div>
      </div>
      <div className="right-panel">
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{weatherData.name}</p>
            </div>
            <div className="temp">
              <h1>{Math.round(weatherData.main.temp)}°C</h1>
            </div>
            <div className="description">
              <p>{weatherData.weather[0].description}</p>
            </div>
          </div>
          <div className="bottom">
            <div className="weather-details">
              <div className="feels">
                <p>Feels like {Math.round(weatherData.main.feels_like)}°C</p>
              </div>
              <div className="humidity">
                <p>Humidity: {weatherData.main.humidity}%</p>
              </div>
              <div className="wind">
                <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              </div>
            </div>
            <div className="date-time">
              <div className="date">
                <p>
                  {new Date().toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="time">
                <p>{getCurrentTime()}</p>
              </div>
            </div>
          </div>
          <div className="search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city or zip code"
            />
            <button onClick={() => setLocation(query)}>Search</button>
          </div>
          <div className="toggle">
            <button onClick={toggleDarkMode}>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
