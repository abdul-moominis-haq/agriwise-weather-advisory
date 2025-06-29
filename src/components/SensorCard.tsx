
import { Thermometer, Droplets, Sun, Activity } from 'lucide-react';

interface SensorReading {
  id: string;
  sensor_type: string;
  value: number;
  unit: string;
  timestamp: string;
}

interface SensorCardProps {
  reading: SensorReading;
}

const SensorCard = ({ reading }: SensorCardProps) => {
  const getSensorIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'temperature':
        return <Thermometer className="h-6 w-6 text-red-500" />;
      case 'humidity':
      case 'soil_moisture':
        return <Droplets className="h-6 w-6 text-blue-500" />;
      case 'light':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatSensorType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getSensorIcon(reading.sensor_type)}
          <div>
            <h3 className="font-semibold text-gray-900">{formatSensorType(reading.sensor_type)}</h3>
            <p className="text-sm text-gray-500">{formatTimestamp(reading.timestamp)}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-1">
          {reading.value}
        </div>
        <div className="text-gray-500 text-sm">{reading.unit}</div>
      </div>
    </div>
  );
};

export default SensorCard;
