
import { useState, useEffect } from 'react';
import { Brain, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RecommendationCard from './RecommendationCard';

interface Device {
  device_id: string;
  device_name: string;
  is_active: boolean;
}

const AIRecommendationsPanel = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's devices
  const { data: devices } = useQuery({
    queryKey: ['user-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iot_devices')
        .select('device_id, device_name, is_active')
        .eq('is_active', true)
        .order('device_name');
      
      if (error) throw error;
      return data as Device[];
    }
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  // Generate AI recommendations mutation
  const generateRecommendations = useMutation({
    mutationFn: async (deviceId: string) => {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/ai-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, forceGenerate: true })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate recommendations');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Recommendations Generated",
        description: `Generated ${data.count} new recommendations`,
      });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark recommendation as read
  const markAsRead = useMutation({
    mutationFn: async (recommendationId: string) => {
      const { error } = await supabase
        .from('recommendations')
        .update({ is_read: true })
        .eq('id', recommendationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  // Dismiss recommendation
  const dismissRecommendation = useMutation({
    mutationFn: async (recommendationId: string) => {
      const { error } = await supabase
        .from('recommendations')
        .update({ is_dismissed: true })
        .eq('id', recommendationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });

  // Set first device as default
  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0].device_id);
    }
  }, [devices, selectedDevice]);

  // Subscribe to real-time recommendation updates
  useEffect(() => {
    const channel = supabase
      .channel('recommendations-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recommendations'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['recommendations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const unreadCount = recommendations?.filter(r => !r.is_read).length || 0;
  const highPriorityCount = recommendations?.filter(r => r.priority === 'high' && !r.is_read).length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 && (
                <span className="text-orange-600 font-medium">
                  {unreadCount} unread
                  {highPriorityCount > 0 && ` (${highPriorityCount} high priority)`}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="">Select Device</option>
            {devices?.map((device) => (
              <option key={device.device_id} value={device.device_id}>
                {device.device_name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => selectedDevice && generateRecommendations.mutate(selectedDevice)}
            disabled={!selectedDevice || generateRecommendations.isPending}
            className="flex items-center space-x-1 bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${generateRecommendations.isPending ? 'animate-spin' : ''}`} />
            <span>Generate</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loadingRecs ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading recommendations...
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onMarkRead={(id) => markAsRead.mutate(id)}
              onDismiss={(id) => dismissRecommendation.mutate(id)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No recommendations available</p>
            <p className="text-sm">Select a device and click "Generate" to get AI-powered farming advice</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationsPanel;
