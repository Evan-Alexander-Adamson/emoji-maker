import { supabase } from './supabase'

export async function generateSvg(prompt: string) {
  try {
    // Call our API route instead of Replicate directly
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })

    const data = await response.json()
    if (!data.success) throw new Error(data.error)

    const svgUrl = data.url
    
    // Generate a unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Upload to the 'generated' bucket
    const svgResponse = await fetch(svgUrl)
    const blob = await svgResponse.blob()
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated')
      .upload(`${fileName}.svg`, blob, {
        contentType: 'image/svg+xml',
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated')
      .getPublicUrl(`${fileName}.svg`)

    return {
      url: publicUrl,
      prompt: prompt,
      likes: 0
    }
  } catch (error) {
    console.error('Error generating SVG:', error)
    throw error
  }
} 