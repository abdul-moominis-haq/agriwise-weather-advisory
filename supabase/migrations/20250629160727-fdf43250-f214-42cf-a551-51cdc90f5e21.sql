
-- Create table for IoT devices
CREATE TABLE public.iot_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'ESP32',
  location TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for sensor readings
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES public.iot_devices(device_id),
  sensor_type TEXT NOT NULL, -- 'temperature', 'humidity', 'soil_moisture', 'light', 'ph', etc.
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL, -- 'celsius', 'fahrenheit', 'percent', 'lux', etc.
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Policies for iot_devices
CREATE POLICY "Users can view their own devices" 
  ON public.iot_devices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own devices" 
  ON public.iot_devices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" 
  ON public.iot_devices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" 
  ON public.iot_devices 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policies for sensor_readings (allow reading data from user's devices)
CREATE POLICY "Users can view readings from their devices" 
  ON public.sensor_readings 
  FOR SELECT 
  USING (
    device_id IN (
      SELECT device_id FROM public.iot_devices WHERE user_id = auth.uid()
    )
  );

-- Allow inserting sensor readings (for ESP32 devices)
CREATE POLICY "Allow inserting sensor readings" 
  ON public.sensor_readings 
  FOR INSERT 
  WITH CHECK (
    device_id IN (
      SELECT device_id FROM public.iot_devices WHERE is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_sensor_readings_device_id ON public.sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp);
CREATE INDEX idx_sensor_readings_sensor_type ON public.sensor_readings(sensor_type);
CREATE INDEX idx_iot_devices_user_id ON public.iot_devices(user_id);

-- Enable realtime for sensor readings
ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
