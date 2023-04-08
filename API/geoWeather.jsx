import React, { useState, useEffect } from "react";

const Home = () => {
  const baseURL = "http://api.openweathermap.org/data/2.5/weather";
  const [weatherData, setWeatherData] = useState(null);

  //establece por defecto la ciudad de new york
  const [location, setLocation] = useState({
    latitude: "40.71427",
    longitude: "-74.00597",
    geoLocated: false,
  });

  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            geolocated: true,
          });
        },
        (error) => {
          setError("Error obteniendo la ubicación");
        }
      );
    } else {
      setError("La geolocalización no está soportada en este navegador.");
    }
  };

  useEffect(() => {
    const getWeather = async () => {
      if (location) {
        const units = "metric";

        //url contempla .env en vite
        const url = `${baseURL}?lat=${location.latitude}&lon=${
          location.longitude
        }&units=${units}&appid=${import.meta.env.VITE_API_ID}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          setError("Error obteniendo el clima");
        }
      }
    };

    getWeather();
  }, [location]);

  return (
    <div>
      <button
        onClick={getLocation}
        style={location.geoLocated ? { backgroundColor: "green" } : {}}
      >
        {location.geoLocated ? "Ubicación obtenida ✓" : "Obtener ubicación"}
      </button>

      {weatherData ? (
        <div>
          <h2>Clima actual en {weatherData.name}</h2>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Descripción: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <div>Cargando...</div>
      )}

      {error && <div>{error}</div>}
    </div>
  );
};

export default Home;
