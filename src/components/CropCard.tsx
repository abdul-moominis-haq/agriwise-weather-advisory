
import { Calendar, Leaf } from 'lucide-react';

interface Crop {
  id: number;
  name: string;
  variety: string;
  plantedDate: string;
  expectedHarvest: string;
  stage: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  progress: number;
}

interface CropCardProps {
  crop: Crop;
}

const CropCard = ({ crop }: CropCardProps) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Leaf className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{crop.name}</h3>
            <p className="text-sm text-gray-500">{crop.variety}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getHealthColor(crop.health)}`}>
          {crop.health}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Growth Progress</span>
          <span>{crop.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${crop.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Stage:</span>
          <span className="font-medium text-gray-900">{crop.stage}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Planted:</span>
          <span className="text-gray-900">{crop.plantedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Harvest:</span>
          <span className="text-gray-900">{crop.expectedHarvest}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
        View Details
      </button>
    </div>
  );
};

export default CropCard;
