
import { Wifi, WifiOff, Settings } from 'lucide-react';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  location?: string;
  is_active: boolean;
  created_at: string;
}

interface DeviceCardProps {
  device: Device;
  onToggleStatus: (deviceId: string, isActive: boolean) => void;
}

const DeviceCard = ({ device, onToggleStatus }: DeviceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${device.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
            {device.is_active ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.device_name}</h3>
            <p className="text-sm text-gray-500">{device.device_type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          device.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {device.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Device ID:</span>
          <span className="font-mono text-gray-900">{device.device_id}</span>
        </div>
        {device.location && (
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-900">{device.location}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Added:</span>
          <span className="text-gray-900">{new Date(device.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onToggleStatus(device.device_id, !device.is_active)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            device.is_active 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {device.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
