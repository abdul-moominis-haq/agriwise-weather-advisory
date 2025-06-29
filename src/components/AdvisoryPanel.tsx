
import { Bell, Calendar, Search } from 'lucide-react';

interface Advisory {
  id: number;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  category: string;
}

const AdvisoryPanel = () => {
  const advisories: Advisory[] = [
    {
      id: 1,
      title: 'Irrigation Recommended',
      message: 'Based on current soil moisture levels and weather forecast, consider watering your tomato crops in the next 24 hours.',
      priority: 'high',
      timestamp: '2 hours ago',
      category: 'Irrigation'
    },
    {
      id: 2,
      title: 'Fertilizer Application',
      message: 'Optimal time for nitrogen fertilizer application for your maize crop. Weather conditions are favorable.',
      priority: 'medium',
      timestamp: '5 hours ago',
      category: 'Fertilizer'
    },
    {
      id: 3,
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in 48 hours. Ensure proper drainage in your fields.',
      priority: 'high',
      timestamp: '1 day ago',
      category: 'Weather'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-green-600" />
          Smart Advisories
        </h2>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {advisories.map((advisory) => (
          <div key={advisory.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900">{advisory.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(advisory.priority)}`}>
                {advisory.priority}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{advisory.message}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{advisory.category}</span>
              <span>{advisory.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium">
        View All Advisories
      </button>
    </div>
  );
};

export default AdvisoryPanel;
