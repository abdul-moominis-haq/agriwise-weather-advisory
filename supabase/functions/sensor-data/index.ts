
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { device_id, sensor_readings } = await req.json()
      
      console.log('Received sensor data:', { device_id, sensor_readings })
      
      // Verify device exists and is active
      const { data: device, error: deviceError } = await supabase
        .from('iot_devices')
        .select('device_id, is_active')
        .eq('device_id', device_id)
        .single()

      if (deviceError || !device) {
        console.error('Device not found:', deviceError)
        return new Response(
          JSON.stringify({ error: 'Device not found or inactive' }), 
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!device.is_active) {
        return new Response(
          JSON.stringify({ error: 'Device is inactive' }), 
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Insert sensor readings
      const readings = sensor_readings.map((reading: any) => ({
        device_id,
        sensor_type: reading.sensor_type,
        value: reading.value,
        unit: reading.unit,
        timestamp: reading.timestamp || new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from('sensor_readings')
        .insert(readings)

      if (error) {
        console.error('Error inserting sensor readings:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to store sensor data' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Successfully stored sensor readings:', data)
      
      return new Response(
        JSON.stringify({ success: true, message: 'Sensor data received' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
