import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Delhi');
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = 'ecc4f31f4c9bc45a5b421e686d1d3f14';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          setWeatherData(data);
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error fetching the weather data:', error));
  }, [url]);

  const handleSearch = () => {
    setLocation(query);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
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
              <p>{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
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
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="toggle">
          <button onClick={toggleDarkMode}>
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
