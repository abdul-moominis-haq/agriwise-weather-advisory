
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { deviceId, forceGenerate = false } = await req.json();

      // Get recent sensor readings for the device
      const { data: readings, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('device_id', deviceId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('timestamp', { ascending: false })
        .limit(50);

      if (readingsError) {
        console.error('Error fetching readings:', readingsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch sensor readings' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!readings || readings.length === 0) {
        return new Response(
          JSON.stringify({ message: 'No recent sensor data available' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get device info
      const { data: device } = await supabase
        .from('iot_devices')
        .select('*, user_id')
        .eq('device_id', deviceId)
        .single();

      if (!device) {
        return new Response(
          JSON.stringify({ error: 'Device not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if we already have recent recommendations (unless forced)
      if (!forceGenerate) {
        const { data: recentRecs } = await supabase
          .from('recommendations')
          .select('id')
          .eq('device_id', deviceId)
          .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Last 6 hours
          .limit(1);

        if (recentRecs && recentRecs.length > 0) {
          return new Response(
            JSON.stringify({ message: 'Recent recommendations already exist' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Prepare sensor data for AI analysis
      const sensorSummary = analyzeSensorData(readings);
      
      // Generate AI recommendations
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an agricultural AI expert. Analyze sensor data and provide farming recommendations. 
              
              Response format must be a JSON array of recommendations:
              [
                {
                  "title": "Brief title",
                  "message": "Detailed recommendation",
                  "priority": "low|medium|high",
                  "category": "irrigation|fertilizer|weather|pest|disease|general",
                  "confidence": 0.85
                }
              ]
              
              Guidelines:
              - Only suggest actionable recommendations
              - Consider crop health, environmental conditions, and optimal growing parameters
              - Prioritize based on urgency and impact
              - Maximum 3 recommendations per analysis
              - Be specific and practical`
            },
            {
              role: 'user',
              content: `Analyze this sensor data from ${device.location || 'farm location'} and provide recommendations:
              
              Device: ${device.device_name} (${device.device_type})
              Location: ${device.location || 'Not specified'}
              
              Recent sensor readings (last 24 hours):
              ${JSON.stringify(sensorSummary, null, 2)}
              
              Please provide specific, actionable farming recommendations based on this data.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      if (!aiResponse.ok) {
        console.error('OpenAI API error:', await aiResponse.text());
        return new Response(
          JSON.stringify({ error: 'Failed to generate AI recommendations' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiData = await aiResponse.json();
      const aiContent = aiData.choices[0].message.content;

      // Parse AI response
      let recommendations;
      try {
        recommendations = JSON.parse(aiContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', aiContent);
        return new Response(
          JSON.stringify({ error: 'Invalid AI response format' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Store recommendations in database
      const recommendationsToInsert = recommendations.map((rec: any) => ({
        user_id: device.user_id,
        device_id: deviceId,
        title: rec.title,
        message: rec.message,
        priority: rec.priority,
        category: rec.category,
        sensor_data: sensorSummary,
        ai_confidence: rec.confidence
      }));

      const { data: insertedRecs, error: insertError } = await supabase
        .from('recommendations')
        .insert(recommendationsToInsert)
        .select();

      if (insertError) {
        console.error('Error inserting recommendations:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to store recommendations' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          recommendations: insertedRecs,
          count: insertedRecs.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function analyzeSensorData(readings: any[]) {
  const sensors: { [key: string]: any[] } = {};
  
  // Group readings by sensor type
  readings.forEach(reading => {
    if (!sensors[reading.sensor_type]) {
      sensors[reading.sensor_type] = [];
    }
    sensors[reading.sensor_type].push({
      value: reading.value,
      timestamp: reading.timestamp,
      unit: reading.unit
    });
  });

  // Calculate statistics for each sensor type
  const summary: { [key: string]: any } = {};
  
  Object.keys(sensors).forEach(sensorType => {
    const values = sensors[sensorType].map(r => parseFloat(r.value));
    const latest = sensors[sensorType][0]; // Most recent reading
    
    summary[sensorType] = {
      current: latest.value,
      unit: latest.unit,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      readings_count: values.length,
      trend: calculateTrend(sensors[sensorType])
    };
  });

  return summary;
}

function calculateTrend(readings: any[]) {
  if (readings.length < 2) return 'stable';
  
  const recent = readings.slice(0, Math.min(5, readings.length));
  const values = recent.map(r => parseFloat(r.value));
  
  const first = values[values.length - 1];
  const last = values[0];
  const change = ((last - first) / first) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
}
