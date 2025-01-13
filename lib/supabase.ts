import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

export async function uploadSvg(svgData: string, fileName: string) {
  try {
    // Convert SVG URL to Blob
    const response = await fetch(svgData);
    const blob = await response.blob();

    // Upload the blob to the 'SVGs' bucket (note the capital letters)
    const { data, error } = await supabase.storage
      .from('SVGs')
      .upload(`${fileName}.svg`, blob, {
        contentType: 'image/svg+xml',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('SVGs')
      .getPublicUrl(`${fileName}.svg`);

    return {
      path: data.path,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error in uploadSvg:', error);
    throw error;
  }
} 