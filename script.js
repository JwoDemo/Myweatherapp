// OpenWeatherMap API configuration
const API_KEY = '235a790f84c436789bb93aa5f39b24dd'; // You'll need to replace this with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_URL = 'https://openweathermap.org/img/wn/';

// Add input validation
function validateZipCode(zipCode) {
    return /^\d{5}$/.test(zipCode);
}

async function getWeather() {
    console.log('getWeather function called');
    const zipCode = document.getElementById('zipCode').value;
    console.log('ZIP code entered:', zipCode);
    const weatherInfo = document.getElementById('weatherInfo');
    const clothingRecommendations = document.getElementById('clothingRecommendations');

    // Validate input
    if (!validateZipCode(zipCode)) {
        console.log('Invalid ZIP code');
        alert('Please enter a valid 5-digit ZIP code');
        return;
    }

    // Sanitize input
    const sanitizedZipCode = zipCode.replace(/[^0-9]/g, '');
    console.log('Sanitized ZIP code:', sanitizedZipCode);

    try {
        console.log('Making API call...');
        const response = await fetch(`${BASE_URL}?zip=${sanitizedZipCode},us&appid=${API_KEY}&units=imperial`);
        console.log('API Response status:', response.status);
        
        const data = await response.json();
        console.log('API Response data:', data);

        if (data.cod === '404' || response.status === 404) {
            weatherInfo.innerHTML = '<p class="error">Sorry, this is not a valid ZIP code.</p>';
            weatherInfo.classList.remove('hidden');
            weatherInfo.classList.add('visible');
            clothingRecommendations.innerHTML = ''; // Clear clothing recommendations on error
            return;
        }

        if (!response.ok) {
            throw new Error('Unable to fetch weather data. Please try again later.');
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

        // Get clothing recommendations
        const recommendations = getClothingRecommendations(sanitizedData.temp, sanitizedData.description);
        
        // Get the weather icon URL
        const iconUrl = `${ICON_URL}${sanitizedData.iconCode}@2x.png`;
        
        // Format the weather information
        const weatherHTML = `
            <div class="weather-header">
                <h2>${sanitizedData.name}</h2>
                <img src="${iconUrl}" alt="${sanitizedData.description}" class="weather-icon">
            </div>
            <p class="temperature">${sanitizedData.temp}°F</p>
            <p class="description">${sanitizedData.description}</p>
            <div class="details">
                <p>Humidity: ${sanitizedData.humidity}%</p>
                <p>Wind Speed: ${sanitizedData.windSpeed} mph</p>
            </div>
        `;

        // Display weather information
        console.log('Updating weather info display');
        weatherInfo.innerHTML = weatherHTML;
        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('visible');

        // Display clothing recommendations
        clothingRecommendations.innerHTML = `
            <h3>What to Wear</h3>
            <ul class="clothing-list">
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;

    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherInfo.innerHTML = '<p class="error">Sorry, this is not a valid ZIP code.</p>';
        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('visible');
        clothingRecommendations.innerHTML = ''; // Clear clothing recommendations on error
    }
}

// Add event listener for Enter key
document.getElementById('zipCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Add click event listener for the button
document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', getWeather);
        console.log('Button click listener added');
    } else {
        console.error('Button not found');
    }
});

function getClothingRecommendations(temp, description) {
    const recommendations = [];
    
    // Temperature-based recommendations
    if (temp < 32) {
        recommendations.push('Heavy winter coat');
        recommendations.push('Warm gloves and scarf');
        recommendations.push('Thermal underwear');
        recommendations.push('Winter boots');
    } else if (temp < 50) {
        recommendations.push('Warm jacket or coat');
        recommendations.push('Gloves');
        recommendations.push('Long-sleeved shirt');
        recommendations.push('Warm pants');
    } else if (temp < 65) {
        recommendations.push('Light jacket or sweater');
        recommendations.push('Long-sleeved shirt');
        recommendations.push('Jeans or casual pants');
    } else if (temp < 75) {
        recommendations.push('Light shirt or t-shirt');
        recommendations.push('Light pants or shorts');
        recommendations.push('Light jacket (optional)');
    } else {
        recommendations.push('Light, breathable clothing');
        recommendations.push('Shorts or light pants');
        recommendations.push('Sun protection (hat, sunscreen)');
    }

    // Weather condition-based recommendations
    if (description.includes('rain')) {
        recommendations.push('Raincoat or umbrella');
        recommendations.push('Waterproof shoes or boots');
    }
    if (description.includes('snow')) {
        recommendations.push('Snow boots');
        recommendations.push('Waterproof gloves');
    }
    if (description.includes('sun') || description.includes('clear')) {
        recommendations.push('Sunglasses');
        recommendations.push('Sun hat or cap');
    }

    return recommendations;
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const clothingRecommendations = document.getElementById('clothingRecommendations');
    
    // Sanitize the data
    const cityName = data.name.replace(/[<>]/g, '');
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description.replace(/[<>]/g, '');
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    // Get clothing recommendations
    const recommendations = getClothingRecommendations(temperature, description);
    
    // Display weather information
    weatherInfo.innerHTML = `
        <h2>${cityName}</h2>
        <p class="temperature">${temperature}°F</p>
        <p class="description">${description}</p>
        <div class="details">
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
        </div>
    `;
    
    // Display clothing recommendations
    clothingRecommendations.innerHTML = `
        <h3>What to Wear</h3>
        <ul class="clothing-list">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;
} 