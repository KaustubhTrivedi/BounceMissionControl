import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter } from 'recharts'
import { Info, Activity, AlertTriangle, ThermometerSun, Gauge } from 'lucide-react'
import { useHistoricMarsWeather } from '../hooks/useNASA'

export const Route = createFileRoute('/mars-weather')({
  component: MarsWeatherPage,
})

function MarsWeatherPage() {
  const { data: weatherResponse, isLoading: loading, error } = useHistoricMarsWeather()
  const weatherData = weatherResponse?.data

  const formatTemperatureChartData = () => {
    if (!weatherData?.temperature_data) return []
    return weatherData.temperature_data.map(item => ({
      sol: item.sol,
      date: item.earth_date,
      min_temp: item.min_temp,
      max_temp: item.max_temp,
      avg_temp: item.avg_temp,
      temp_range: item.temp_range,
      season: item.season
    }))
  }

  const formatPressureChartData = () => {
    if (!weatherData?.pressure_data) return []
    return weatherData.pressure_data.map(item => ({
      sol: item.sol,
      date: item.earth_date,
      pressure: item.pressure,
      pressure_min: item.pressure_min,
      pressure_max: item.pressure_max,
      season: item.season
    }))
  }

  const formatWindChartData = () => {
    if (!weatherData?.wind_data) return []
    return weatherData.wind_data.filter(item => item.wind_speed !== null).map(item => ({
      sol: item.sol,
      date: item.earth_date,
      wind_speed: item.wind_speed,
      wind_direction: item.wind_direction,
      wind_direction_degrees: item.wind_direction_degrees,
      season: item.season
    }))
  }

  const formatTempPressureScatterData = () => {
    if (!weatherData?.temperature_data || !weatherData?.pressure_data) return []
    
    const data = []
    for (let i = 0; i < weatherData.temperature_data.length; i++) {
      const tempData = weatherData.temperature_data[i]
      const pressureData = weatherData.pressure_data.find(p => p.sol === tempData.sol)
      
      if (tempData.avg_temp && pressureData?.pressure) {
        data.push({
          temperature: tempData.avg_temp,
          pressure: pressureData.pressure,
          sol: tempData.sol,
          season: tempData.season
        })
      }
    }
    return data
  }

  const getTemperatureStats = () => {
    if (!weatherData?.temperature_data) return { min: 0, max: 0, avg: 0 }
    const temps = weatherData.temperature_data.flatMap(d => [d.min_temp, d.max_temp, d.avg_temp]).filter(t => t !== null)
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
      avg: temps.reduce((a, b) => a + b, 0) / temps.length
    }
  }

  const getPressureStats = () => {
    if (!weatherData?.pressure_data) return { min: 0, max: 0, avg: 0 }
    const pressures = weatherData.pressure_data.map(d => d.pressure).filter(p => p !== null)
    return {
      min: Math.min(...pressures),
      max: Math.max(...pressures),
      avg: pressures.reduce((a, b) => a + b, 0) / pressures.length
    }
  }

  const getWindStats = () => {
    if (!weatherData?.wind_data) return { min: 0, max: 0, avg: 0 }
    const winds = weatherData.wind_data.map(d => d.wind_speed).filter(w => w !== null && w !== undefined)
    if (winds.length === 0) return { min: 0, max: 0, avg: 0 }
    return {
      min: Math.min(...winds),
      max: Math.max(...winds),
      avg: winds.reduce((a, b) => a + b, 0) / winds.length
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load historic weather data: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No historic weather data available.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const tempStats = getTemperatureStats()
  const pressureStats = getPressureStats()
  const windStats = getWindStats()

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          📊 Historic Martian Weather Data
        </h1>
        <p className="text-xl text-gray-600">
          Real atmospheric measurements from NASA's Mars missions
        </p>
      </div>

      {/* InSight Mission Status Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>InSight Mission Legacy:</strong> NASA's InSight Mars lander concluded its mission in December 2022 
          after nearly 4 years of groundbreaking science. The data visualized here represents real atmospheric 
          measurements from {weatherData.mission_info.location}, providing invaluable insights into Martian weather patterns.
        </AlertDescription>
      </Alert>

      {/* Mission Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium ml-2">Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.mission_info.name}</div>
            <p className="text-xs text-muted-foreground">{weatherData.mission_info.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <ThermometerSun className="h-4 w-4 text-red-600" />
            <CardTitle className="text-sm font-medium ml-2">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.mission_info.location}</div>
            <p className="text-xs text-muted-foreground">
              {weatherData.mission_info.coordinates.latitude.toFixed(2)}°N, {weatherData.mission_info.coordinates.longitude.toFixed(2)}°E
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Gauge className="h-4 w-4 text-green-600" />
            <CardTitle className="text-sm font-medium ml-2">Data Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.mission_info.total_sols} Sols</div>
            <p className="text-xs text-muted-foreground">
              {weatherData.mission_info.earth_dates.start} to {weatherData.mission_info.earth_dates.end}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🌡️ Temperature Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Minimum:</span>
              <span className="font-medium text-blue-600">{tempStats.min.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum:</span>
              <span className="font-medium text-red-600">{tempStats.max.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Average:</span>
              <span className="font-medium">{tempStats.avg.toFixed(1)}°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Pressure Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Minimum:</span>
              <span className="font-medium text-blue-600">{pressureStats.min.toFixed(1)} Pa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum:</span>
              <span className="font-medium text-red-600">{pressureStats.max.toFixed(1)} Pa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Average:</span>
              <span className="font-medium">{pressureStats.avg.toFixed(1)} Pa</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💨 Wind Speed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Minimum:</span>
              <span className="font-medium text-blue-600">{windStats.min.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum:</span>
              <span className="font-medium text-red-600">{windStats.max.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Average:</span>
              <span className="font-medium">{windStats.avg.toFixed(1)} m/s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Temperature Trends */}
        <Card>
          <CardHeader>
            <CardTitle>🌡️ Temperature Trends Over Sols</CardTitle>
            <CardDescription>
              Daily minimum, maximum, and average temperatures showing Mars' extreme temperature variations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatTemperatureChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sol" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Sol ${value}`}
                    formatter={(value: number, name: string) => [`${value?.toFixed(1)}°C`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="max_temp" stackId="1" stroke="#ef4444" fill="#fee2e2" name="Max Temperature" />
                  <Area type="monotone" dataKey="min_temp" stackId="2" stroke="#3b82f6" fill="#dbeafe" name="Min Temperature" />
                  <Line type="monotone" dataKey="avg_temp" stroke="#f59e0b" strokeWidth={2} name="Average Temperature" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Atmospheric Pressure */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Atmospheric Pressure Over Time</CardTitle>
            <CardDescription>
              Daily atmospheric pressure measurements showing seasonal and diurnal variations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatPressureChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sol" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Sol ${value}`}
                    formatter={(value: number) => [`${value?.toFixed(1)} Pa`, 'Pressure']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2} name="Atmospheric Pressure" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wind Speed */}
        <Card>
          <CardHeader>
            <CardTitle>💨 Wind Speed Measurements</CardTitle>
            <CardDescription>
              Wind speed variations showing Mars' dynamic atmospheric conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatWindChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sol" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Sol ${value}`}
                    formatter={(value: number) => [`${value?.toFixed(1)} m/s`, 'Wind Speed']}
                  />
                  <Legend />
                  <Bar dataKey="wind_speed" fill="#10b981" name="Wind Speed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Temperature vs Pressure Correlation */}
        <Card>
          <CardHeader>
            <CardTitle>🔬 Temperature vs Pressure Correlation</CardTitle>
            <CardDescription>
              Scatter plot showing the relationship between atmospheric temperature and pressure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={formatTempPressureScatterData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="temperature" name="Temperature" unit="°C" />
                  <YAxis dataKey="pressure" name="Pressure" unit="Pa" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'pressure' ? `${value?.toFixed(1)} Pa` : `${value?.toFixed(1)}°C`,
                      name === 'pressure' ? 'Pressure' : 'Temperature'
                    ]}
                  />
                  <Legend />
                  <Scatter name="Sol Data" dataKey="pressure" fill="#f59e0b" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              🚀 Data courtesy of NASA's InSight Mars Lander Mission
            </p>
            <p className="text-xs text-gray-500">
              InSight operated from November 2018 to December 2022, providing unprecedented insights into Mars' interior and atmosphere.
              This weather data represents real measurements from the Martian surface at Elysium Planitia.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 