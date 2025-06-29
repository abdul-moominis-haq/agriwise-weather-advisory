
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SensorCard from './SensorCard';
import DeviceCard from './DeviceCard';
import { Plus, Activity } from 'lucide-react';
import { toast } from 'sonner';

const IoTDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [newDevice, setNewDevice] = useState({
    device_id: '',
    device_name: '',
    location: ''
  });
  const [showAddDevice, setShowAddDevice] = useState(false);

  // Fetch devices
  const { data: devices, refetch: refetchDevices } = useQuery({
    queryKey: ['iot-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iot_devices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated
  });

  // Fetch latest sensor readings
  const { data: sensorReadings } = useQuery({
    queryKey: ['sensor-readings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Real-time subscription for sensor readings
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('sensor-readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        (payload) => {
          console.log('New sensor reading:', payload);
          toast.success('New sensor data received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.functions.invoke('register-device', {
        body: newDevice
      });

      if (error) throw error;

      toast.success('Device registered successfully!');
      setNewDevice({ device_id: '', device_name: '', location: '' });
      setShowAddDevice(false);
      refetchDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to register device');
    }
  };

  const handleToggleDeviceStatus = async (deviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('iot_devices')
        .update({ is_active: isActive })
        .eq('device_id', deviceId);

      if (error) throw error;

      toast.success(`Device ${isActive ? 'activated' : 'deactivated'} successfully!`);
      refetchDevices();
    } catch (error) {
      console.error('Error updating device status:', error);
      toast.error('Failed to update device status');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to access IoT dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-green-600" />
            IoT Dashboard
          </h2>
          <p className="text-gray-600">Monitor your ESP32 sensors and devices</p>
        </div>
        <button
          onClick={() => setShowAddDevice(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Add Device Form */}
      {showAddDevice && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Register New ESP32 Device</h3>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device ID
                </label>
                <input
                  type="text"
                  value={newDevice.device_id}
                  onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ESP32_001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDevice.device_name}
                  onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Field Sensor 1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="North Field A"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Register Device
              </button>
              <button
                type="button"
                onClick={() => setShowAddDevice(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Devices */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Devices</h3>
        {devices && devices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggleStatus={handleToggleDeviceStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No devices registered yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first ESP32 sensor to get started</p>
          </div>
        )}
      </div>

      {/* Latest Sensor Readings */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Latest Sensor Readings</h3>
        {sensorReadings && sensorReadings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensorReadings.slice(0, 8).map((reading) => (
              <SensorCard key={reading.id} reading={reading} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No sensor data available</p>
            <p className="text-sm text-gray-400 mt-1">Data will appear here once your ESP32 devices start transmitting</p>
          </div>
        )}
      </div>

      {/* ESP32 Setup Instructions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">ESP32 Setup Instructions</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p><strong>HTTP Endpoint:</strong> <code className="bg-blue-100 px-2 py-1 rounded">https://bpioxfqsuxvgbdyjjbhi.supabase.co/functions/v1/sensor-data</code></p>
          <p><strong>Method:</strong> POST</p>
          <p><strong>Headers:</strong> Content-Type: application/json</p>
          <div>
            <p><strong>Payload Example:</strong></p>
            <pre className="bg-blue-100 p-3 rounded mt-2 text-xs overflow-x-auto">
{`{
  "device_id": "ESP32_001",
  "sensor_readings": [
    {
      "sensor_type": "temperature",
      "value": 25.5,
      "unit": "celsius"
    },
    {
      "sensor_type": "humidity", 
      "value": 65.2,
      "unit": "percent"
    },
    {
      "sensor_type": "soil_moisture",
      "value": 45.8,
      "unit": "percent"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;
