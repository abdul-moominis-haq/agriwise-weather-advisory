
import { Cloud, CloudRain, Sun } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

interface WeatherCardProps {
  data: WeatherData;
  title: string;
  subtitle?: string;
}

const WeatherCard = ({ data, title, subtitle }: WeatherCardProps) => {
  const getWeatherIcon = () => {
    switch (data.condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.temperature}°C</div>
          <div className="text-xs text-gray-500">Temperature</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data.humidity}%</div>
          <div className="text-xs text-gray-500">Humidity</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{data.rainfall}mm</div>
          <div className="text-xs text-gray-500">Rainfall</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
