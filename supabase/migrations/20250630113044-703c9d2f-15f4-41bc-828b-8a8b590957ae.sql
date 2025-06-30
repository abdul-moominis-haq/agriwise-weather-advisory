
-- Create table for AI recommendations
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  device_id TEXT REFERENCES public.iot_devices(device_id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL, -- 'irrigation', 'fertilizer', 'weather', 'pest', 'disease', etc.
  sensor_data JSONB, -- Store the sensor readings that triggered this recommendation
  ai_confidence DECIMAL(3,2), -- AI confidence score (0.00 to 1.00)
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration for time-sensitive recommendations
);

-- Enable Row Level Security
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommendations
CREATE POLICY "Users can view their own recommendations" 
  ON public.recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
  ON public.recommendations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow the AI system to insert recommendations for any user's devices
CREATE POLICY "Allow AI system to insert recommendations" 
  ON public.recommendations 
  FOR INSERT 
  WITH CHECK (
    device_id IN (
      SELECT device_id FROM public.iot_devices WHERE is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_device_id ON public.recommendations(device_id);
CREATE INDEX idx_recommendations_created_at ON public.recommendations(created_at);
CREATE INDEX idx_recommendations_priority ON public.recommendations(priority);
CREATE INDEX idx_recommendations_category ON public.recommendations(category);
CREATE INDEX idx_recommendations_is_read ON public.recommendations(is_read);

-- Enable realtime for recommendations
ALTER TABLE public.recommendations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recommendations;
