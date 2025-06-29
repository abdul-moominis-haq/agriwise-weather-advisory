
import { useState } from 'react';
import CropCard from '../components/CropCard';
import { Plus, Search, Calendar } from 'lucide-react';

const Crops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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
    },
    {
      id: 4,
      name: 'Carrots',
      variety: 'Nantes',
      plantedDate: 'Apr 1, 2024',
      expectedHarvest: 'Aug 1, 2024',
      stage: 'Growing',
      health: 'good' as const,
      progress: 40
    }
  ];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || crop.health === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Management</h1>
          <p className="text-gray-600">Monitor and manage all your crops in one place</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Health Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>

              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add New Crop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Planting Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Planting Calendar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">This Week</h3>
              <p className="text-sm text-green-600">Perfect time to plant lettuce and spinach</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Next Week</h3>
              <p className="text-sm text-blue-600">Consider planting beans and cucumbers</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">This Month</h3>
              <p className="text-sm text-yellow-600">Prepare soil for summer crops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crops;
