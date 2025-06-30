
import { useState, useEffect } from 'react';
import { MapPin, Cloud, Thermometer, Droplets, Eye, Wind, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { weatherService, WeatherData, GeolocationData } from '@/services/weatherApi';
import { useToast } from '@/hooks/use-toast';

interface FarmingRecommendation {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  icon: React.ReactNode;
}

const WeatherFarmingPanel = () => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [weatherApiKey, setWeatherApiKey] = useState<string>('');
  const { toast } = useToast();

  // Get user's location
  const getLocation = async () => {
    try {
      const locationData = await weatherService.getCurrentPosition();
      setLocation(locationData);
      toast({
        title: "Location Found",
        description: `Using coordinates: ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Unable to get your location. Please enable location services.",
        variant: "destructive",
      });
    }
  };

  // Fetch current weather
  const { data: currentWeather, isLoading: weatherLoading, error: weatherError } = useQuery({
    queryKey: ['current-weather', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location || !weatherApiKey) return null;
      weatherService.setApiKey(weatherApiKey);
      return await weatherService.getWeatherByLocation(location.latitude, location.longitude);
    },
    enabled: !!location && !!weatherApiKey,
    refetchInterval: 600000, // Refresh every 10 minutes
  });

  // Generate farming recommendations based on weather
  const generateFarmingRecommendations = (weather: WeatherData): FarmingRecommendation[] => {
    const recommendations: FarmingRecommendation[] = [];

    // Temperature-based recommendations
    if (weather.temperature > 35) {
      recommendations.push({
        title: "Heat Stress Alert",
        message: "High temperatures detected. Increase irrigation frequency and provide shade for sensitive crops. Consider early morning or evening activities.",
        priority: 'high',
        category: 'irrigation',
        icon: <Thermometer className="h-4 w-4 text-red-500" />
      });
    } else if (weather.temperature < 5) {
      recommendations.push({
        title: "Frost Protection",
        message: "Low temperatures may cause frost damage. Cover sensitive plants and consider using frost protection methods.",
        priority: 'high',
        category: 'weather',
        icon: <AlertCircle className="h-4 w-4 text-blue-500" />
      });
    }

    // Humidity-based recommendations
    if (weather.humidity > 80) {
      recommendations.push({
        title: "High Humidity Warning",
        message: "High humidity levels increase disease risk. Improve air circulation and monitor for fungal diseases.",
        priority: 'medium',
        category: 'disease',
        icon: <Droplets className="h-4 w-4 text-blue-500" />
      });
    } else if (weather.humidity < 30) {
      recommendations.push({
        title: "Low Humidity Alert",
        message: "Low humidity may stress plants. Increase irrigation and consider misting for humidity-loving crops.",
        priority: 'medium',
        category: 'irrigation',
        icon: <Droplets className="h-4 w-4 text-orange-500" />
      });
    }

    // Wind-based recommendations
    if (weather.windSpeed > 15) {
      recommendations.push({
        title: "Strong Wind Alert",
        message: "High winds may damage crops. Secure tall plants and greenhouses. Avoid spraying pesticides.",
        priority: 'medium',
        category: 'weather',
        icon: <Wind className="h-4 w-4 text-gray-500" />
      });
    }

    // Rainfall recommendations
    if (weather.rainfall > 10) {
      recommendations.push({
        title: "Heavy Rainfall",
        message: "Significant rainfall detected. Check drainage systems and delay irrigation. Monitor for waterlogging.",
        priority: 'medium',
        category: 'irrigation',
        icon: <Cloud className="h-4 w-4 text-blue-600" />
      });
    } else if (weather.rainfall === 0 && weather.humidity < 50) {
      recommendations.push({
        title: "Dry Conditions",
        message: "No rainfall and low humidity. Plan irrigation schedule and monitor soil moisture levels.",
        priority: 'low',
        category: 'irrigation',
        icon: <Droplets className="h-4 w-4 text-yellow-500" />
      });
    }

    // General farming recommendations based on conditions
    if (weather.condition === 'clear' && weather.temperature >= 20 && weather.temperature <= 30) {
      recommendations.push({
        title: "Optimal Growing Conditions",
        message: "Perfect weather for most farming activities. Good time for planting, harvesting, and field work.",
        priority: 'low',
        category: 'general',
        icon: <Cloud className="h-4 w-4 text-green-500" />
      });
    }

    return recommendations;
  };

  const farmingRecommendations = currentWeather ? generateFarmingRecommendations(currentWeather) : [];

  useEffect(() => {
    // Try to get location on component mount
    getLocation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Weather API Key Input */}
      {!weatherApiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Weather API Setup Required</h3>
          <p className="text-sm text-yellow-700 mb-3">
            To get real-time weather data, please enter your OpenWeatherMap API key. 
            <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline ml-1">
              Get free API key here
            </a>
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="Enter OpenWeatherMap API key"
              className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm"
              onChange={(e) => setWeatherApiKey(e.target.value)}
            />
            <button 
              onClick={getLocation}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
            >
              Setup
            </button>
          </div>
        </div>
      )}

      {/* Location Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Location & Weather
          </h2>
          <button
            onClick={getLocation}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Update Location
          </button>
        </div>

        {location && (
          <div className="text-sm text-gray-600 mb-4">
            <p>Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
            <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
          </div>
        )}

        {weatherLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading weather data...</span>
          </div>
        )}

        {weatherError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">Failed to load weather data. Please check your API key and internet connection.</p>
          </div>
        )}

        {currentWeather && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{currentWeather.temperature}°C</div>
              <div className="text-xs text-gray-500">Temperature</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Droplets className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{currentWeather.humidity}%</div>
              <div className="text-xs text-gray-500">Humidity</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Wind className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold text-gray-600">{currentWeather.windSpeed}m/s</div>
              <div className="text-xs text-gray-500">Wind Speed</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <Cloud className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold text-indigo-600">{currentWeather.rainfall}mm</div>
              <div className="text-xs text-gray-500">Rainfall</div>
            </div>
          </div>
        )}

        {currentWeather && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>{currentWeather.location.name}, {currentWeather.location.country}:</strong> {currentWeather.description}
            </p>
          </div>
        )}
      </div>

      {/* Farming Recommendations */}
      {farmingRecommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather-Based Farming Recommendations</h2>
          <div className="space-y-3">
            {farmingRecommendations.map((rec, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start space-x-3">
                  {rec.icon}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{rec.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherFarmingPanel;
