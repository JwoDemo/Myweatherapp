// OpenWeatherMap API configuration
const API_KEY = process.env.OPENWEATHER_API_KEY || '235a790f84c436789bb93aa5f39b24dd'; // You'll need to replace this with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_URL = 'https://openweathermap.org/img/wn/';

// Add input validation
function validateZipCode(zipCode) {
    return /^\d{5}$/.test(zipCode);
}

async function getWeather() {
    const zipCode = document.getElementById('zipCode').value;
    const weatherInfo = document.getElementById('weatherInfo');

    // Validate input
    if (!validateZipCode(zipCode)) {
        alert('Please enter a valid 5-digit ZIP code');
        return;
    }

    // Sanitize input
    const sanitizedZipCode = zipCode.replace(/[^0-9]/g, '');

    console.log('Making API call for ZIP code:', sanitizedZipCode);
    const url = `${BASE_URL}?zip=${sanitizedZipCode},us&appid=${API_KEY}&units=imperial`;
    console.log('API URL:', url);

    try {
        const response = await fetch(url);
        console.log('API Response status:', response.status);
        console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);

        if (data.cod === '404') {
            throw new Error('ZIP code not found');
        }

        // Sanitize output before displaying
        const sanitizedData = {
            name: data.name.replace(/[<>]/g, ''),
            temp: Math.round(data.main.temp * 10) / 10,
            description: data.weather[0].description.replace(/[<>]/g, ''),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            iconCode: data.weather[0].icon
        };

        // Convert temperature to Fahrenheit and round to 1 decimal place
        const temp = sanitizedData.temp;
        
        // Get the weather icon URL
        const iconUrl = `${ICON_URL}${sanitizedData.iconCode}@2x.png`;
        
        // Format the weather information
        const weatherHTML = `
            <div class="weather-header">
                <h2>${sanitizedData.name}</h2>
                <img src="${iconUrl}" alt="${sanitizedData.description}" class="weather-icon">
            </div>
            <p class="temperature">${temp}°F</p>
            <p class="description">${sanitizedData.description}</p>
            <div class="details">
                <p>Humidity: ${sanitizedData.humidity}%</p>
                <p>Wind Speed: ${sanitizedData.windSpeed} mph</p>
            </div>
        `;

        weatherInfo.innerHTML = weatherHTML;
        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('visible');

    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherInfo.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('visible');
    }
}

// Add event listener for Enter key
document.getElementById('zipCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
}); 