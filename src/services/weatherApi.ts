
// Free weather API service using OpenWeatherMap (requires API key but has free tier)
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  rainfall: number;
  condition: string;
  description: string;
  location: {
    lat: number;
    lon: number;
    name: string;
    country: string;
  };
  timestamp: string;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private apiKey: string = '';

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentPosition(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  async getWeatherByLocation(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('Weather API key not set');
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        pressure: data.main.pressure,
        visibility: data.visibility ? data.visibility / 1000 : 0, // Convert to km
        uvIndex: 0, // Would need UV Index API call
        rainfall: data.rain?.['1h'] || 0,
        condition: data.weather[0].main.toLowerCase(),
        description: data.weather[0].description,
        location: {
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: data.name,
          country: data.sys.country
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getWeatherForecast(lat: number, lon: number, days: number = 5): Promise<WeatherData[]> {
    if (!this.apiKey) {
      throw new Error('Weather API key not set');
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&cnt=${days * 8}` // 8 forecasts per day (every 3 hours)
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.list.map((item: any) => ({
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: item.wind?.speed || 0,
        pressure: item.main.pressure,
        visibility: item.visibility ? item.visibility / 1000 : 0,
        uvIndex: 0,
        rainfall: item.rain?.['3h'] || 0,
        condition: item.weather[0].main.toLowerCase(),
        description: item.weather[0].description,
        location: {
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
          name: data.city.name,
          country: data.city.country
        },
        timestamp: item.dt_txt
      }));
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }
}

export const weatherService = WeatherService.getInstance();
