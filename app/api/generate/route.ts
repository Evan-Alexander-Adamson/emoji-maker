import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: prompt,
          num_outputs: 1
        }
      }
    );
    
    return NextResponse.json({ success: true, url: output[0] });
  } catch (error) {
    console.error('Error generating SVG:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate SVG' },
      { status: 500 }
    );
  }
}

// Add CORS headers if needed
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 