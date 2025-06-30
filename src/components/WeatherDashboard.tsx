
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, MapPin, Brain, TrendingUp } from 'lucide-react';
import WeatherFarmingPanel from './WeatherFarmingPanel';
import AIRecommendationsPanel from './AIRecommendationsPanel';

const WeatherDashboard = () => {
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather & AI Farming Assistant</h1>
          <p className="text-gray-600">Real-time weather data and intelligent farming recommendations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="weather" className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Weather & GPS</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="space-y-6">
            <WeatherFarmingPanel />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIRecommendationsPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Analytics</h2>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Weather analytics and historical data visualization</p>
                <p className="text-sm">Coming soon - integrating with weather history API</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeatherDashboard;
