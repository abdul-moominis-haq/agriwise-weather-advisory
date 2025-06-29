
import WeatherCard from '../components/WeatherCard';
import AdvisoryPanel from '../components/AdvisoryPanel';
import CropCard from '../components/CropCard';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const currentWeather = {
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    condition: 'cloudy' as const
  };

  const forecastWeather = {
    temperature: 31,
    humidity: 58,
    rainfall: 0,
    condition: 'sunny' as const
  };

  const crops = [
    {
      id: 1,
      name: 'Tomatoes',
      variety: 'Roma',
      plantedDate: 'Mar 15, 2024',
      expectedHarvest: 'Jun 15, 2024',
      stage: 'Flowering',
      health: 'excellent' as const,
      progress: 75
    },
    {
      id: 2,
      name: 'Maize',
      variety: 'Sweet Corn',
      plantedDate: 'Feb 28, 2024',
      expectedHarvest: 'Jul 10, 2024',
      stage: 'Vegetative',
      health: 'good' as const,
      progress: 60
    },
    {
      id: 3,
      name: 'Peppers',
      variety: 'Bell Pepper',
      plantedDate: 'Apr 5, 2024',
      expectedHarvest: 'Jul 20, 2024',
      stage: 'Seedling',
      health: 'fair' as const,
      progress: 25
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">Monitor your crops and get AI-powered recommendations</p>
        </div>

        {/* Weather Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <WeatherCard 
            data={currentWeather} 
            title="Current Weather" 
            subtitle="Real-time conditions"
          />
          <WeatherCard 
            data={forecastWeather} 
            title="Tomorrow's Forecast" 
            subtitle="AI-powered prediction"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crops Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Crops</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Crop</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crops.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </div>

          {/* Advisory Panel */}
          <div className="lg:col-span-1">
            <AdvisoryPanel />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3</div>
            <div className="text-gray-600">Active Crops</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Advisories</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">85%</div>
            <div className="text-gray-600">Avg Health</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
            <div className="text-gray-600">Days to Harvest</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
