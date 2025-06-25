"use strict";
module.exports = {
    apiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
    baseUrl: 'https://api.nasa.gov',
    endpoints: {
        apod: '/planetary/apod',
        marsRover: '/mars-photos/api/v1/rovers', // Base endpoint for all rovers
        marsRoverManifest: '/mars-photos/api/v1/manifests', // For rover info and latest sol
        insightWeather: '/insight_weather/', // InSight weather data (historical)
        marsWeatherService: 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json', // MSL weather feed
        maasWeather: 'http://marsweather.ingenology.com/v1/latest/' // MAAS API for current Mars weather
    },
    // Available Mars rovers
    rovers: ['curiosity', 'opportunity', 'spirit', 'perseverance'],
    timeout: 10000, // 10 seconds
    retries: 3
};
