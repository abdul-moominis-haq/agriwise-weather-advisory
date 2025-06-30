
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Activity, Brain } from 'lucide-react';
import IoTDashboard from '@/components/IoTDashboard';
import AIRecommendationsPanel from '@/components/AIRecommendationsPanel';

const Crops = () => {
  const [activeTab, setActiveTab] = useState('crops');

  const cropData = [
    {
      id: 1,
      name: 'Tomatoes',
      variety: 'Roma',
      plantedDate: 'March 15, 2024',
      expectedHarvest: 'June 15, 2024',
      stage: 'Flowering',
      health: 'Excellent',
      progress: 75
    },
    {
      id: 2,
      name: 'Corn',
      variety: 'Sweet Corn',
      plantedDate: 'April 1, 2024',
      expectedHarvest: 'July 20, 2024',
      stage: 'Vegetative',
      health: 'Good',
      progress: 60
    },
    {
      id: 3,
      name: 'Lettuce',
      variety: 'Romaine',
      plantedDate: 'April 10, 2024',
      expectedHarvest: 'June 1, 2024',
      stage: 'Mature',
      health: 'Excellent',
      progress: 90
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop & IoT Management</h1>
          <p className="text-gray-600">Monitor your crops, IoT sensors, and get AI-powered recommendations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="crops" className="flex items-center space-x-2">
              <Leaf className="h-4 w-4" />
              <span>Crops</span>
            </TabsTrigger>
            <TabsTrigger value="iot" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>IoT Sensors</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Your Crops</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Crop</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Variety</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Planted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Expected Harvest</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Stage</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Health</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropData.map((crop) => (
                      <tr key={crop.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{crop.name}</td>
                        <td className="py-3 px-4 text-gray-600">{crop.variety}</td>
                        <td className="py-3 px-4 text-gray-600">{crop.plantedDate}</td>
                        <td className="py-3 px-4 text-gray-600">{crop.expectedHarvest}</td>
                        <td className="py-3 px-4 text-gray-600">{crop.stage}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            crop.health === 'Excellent' ? 'bg-green-100 text-green-600' :
                            crop.health === 'Good' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {crop.health}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${crop.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{crop.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="iot">
            <IoTDashboard />
          </TabsContent>

          <TabsContent value="ai">
            <AIRecommendationsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Crops;
