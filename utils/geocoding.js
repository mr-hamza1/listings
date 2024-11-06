// utils/geocoding.js
const axios = require('axios');

// Function to geocode location using Nominatim API
async function geocodeLocation(locationName) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
        const results = response.data;

        if (results && results.length > 0) {
            const { lat, lon } = results[0];
            return { lat: parseFloat(lat), lng: parseFloat(lon) }; // Return latitude and longitude
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { geocodeLocation };
