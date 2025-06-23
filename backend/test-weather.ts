import { fetchPerseveranceWeatherData, fetchHistoricMarsWeatherData } from './src/helpers/nasa-api.helper';

interface TemperatureDataPoint {
  sol: number;
  earth_date: string;
  min_temp: number | null;
  max_temp: number | null;
  avg_temp: number | null;
  temp_range: number | null;
  season: string;
  sample_count: number;
}

interface PressureDataPoint {
  sol: number;
  earth_date: string;
  pressure: number | null;
  pressure_min: number | null;
  pressure_max: number | null;
  season: string;
  sample_count: number;
}

async function testWeatherAPI() {
  console.log('Testing Mars Weather APIs...\n');
  
  try {
    // Test current weather
    console.log('🔴 Testing Current Weather API:');
    const weatherData = await fetchPerseveranceWeatherData();
    console.log('✅ Current weather data retrieved successfully!');
    console.log('📍 Location:', weatherData.location.name);
    console.log('🗓️  Sol:', weatherData.sol_data.sol);
    console.log('📅 Earth Date:', weatherData.sol_data.terrestrial_date);
    
    if (weatherData.sol_data.temperature?.air) {
      console.log('🌡️  Temperature (Air):', `${weatherData.sol_data.temperature.air.average}°C (${weatherData.sol_data.temperature.air.minimum}°C to ${weatherData.sol_data.temperature.air.maximum}°C)`);
    }
    
    if (weatherData.sol_data.pressure) {
      console.log('📊 Pressure:', `${weatherData.sol_data.pressure.average} Pa`);
    }
    
    if (weatherData.sol_data.wind?.speed && weatherData.sol_data.wind?.direction) {
      console.log('💨 Wind:', `${weatherData.sol_data.wind.speed.average} m/s ${weatherData.sol_data.wind.direction.compass_point}`);
    }
    
    console.log('🌍 Season:', weatherData.sol_data.season);
    console.log('🌫️  Atmosphere:', weatherData.sol_data.atmosphere_opacity);
    console.log('🌅 Sunrise:', weatherData.sol_data.sunrise);
    console.log('🌇 Sunset:', weatherData.sol_data.sunset);
    console.log('⏰ Last Updated:', new Date(weatherData.timestamp).toLocaleString());

    console.log('\n' + '='.repeat(60) + '\n');

    // Test historic weather
    console.log('📊 Testing Historic Weather API:');
    const historicData = await fetchHistoricMarsWeatherData();
    console.log('✅ Historic weather data retrieved successfully!');
    console.log('🏛️  Mission:', historicData.mission_info.name);
    console.log('📍 Location:', historicData.mission_info.location);
    console.log('⏳ Duration:', historicData.mission_info.mission_duration);
    console.log('📊 Status:', historicData.mission_info.status);
    console.log('📈 Temperature Records:', historicData.temperature_data.length);
    console.log('📈 Pressure Records:', historicData.pressure_data.length);
    console.log('📈 Wind Records:', historicData.wind_data.length);
    
    if (historicData.temperature_data.length > 0) {
      const tempData = historicData.temperature_data;
      const minTemp = Math.min(...tempData.map((d: TemperatureDataPoint) => d.min_temp || Infinity));
      const maxTemp = Math.max(...tempData.map((d: TemperatureDataPoint) => d.max_temp || -Infinity));
      console.log('🌡️  Temperature Range:', `${minTemp}°C to ${maxTemp}°C`);
    }

    if (historicData.pressure_data.length > 0) {
      const pressureData = historicData.pressure_data;
      const minPressure = Math.min(...pressureData.map((d: PressureDataPoint) => d.pressure || Infinity));
      const maxPressure = Math.max(...pressureData.map((d: PressureDataPoint) => d.pressure || -Infinity));
      console.log('📊 Pressure Range:', `${minPressure} Pa to ${maxPressure} Pa`);
    }

    console.log('📅 Earth Dates:', `${historicData.mission_info.earth_dates.start} to ${historicData.mission_info.earth_dates.end}`);

  } catch (error) {
    console.error('❌ Error testing weather APIs:', error);
  }
}

testWeatherAPI(); 