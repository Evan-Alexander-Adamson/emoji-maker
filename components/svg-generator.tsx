'use client';

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { ImageGrid } from '@/components/image-grid'
import { generateSvg } from '@/lib/generate-svg'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { supabase } from '@/lib/supabase'
import { useUser } from "@clerk/nextjs";
import { uploadSvg } from '@/lib/supabase'
import Link from 'next/link'
import { toast } from "sonner"
import { TypeWriter } from '@/components/type-writer'

interface GeneratedImage {
  id: string
  url: string
  likes: number
  prompt: string
}

export function SvgGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [progress, setProgress] = useState(0)
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all')
  const { user } = useUser();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGenerating) {
      setProgress(0)
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer)
            return 90
          }
          return prev + 1
        })
      }, 150)
    } else {
      setProgress(100)
      timer = setTimeout(() => {
        setProgress(0)
      }, 400)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
        clearTimeout(timer)
      }
    }
  }, [isGenerating])

  // Fetch existing images on mount
  useEffect(() => {
    async function fetchImages() {
      try {
        // Clear existing images when user changes
        setImages([]);
        
        console.log('Fetching images with filterMode:', filterMode);
        console.log('Current user:', user?.id);

        // Get all images from generated_images table
        let query = supabase
          .from('generated_images')
          .select('*')
          .order('created_at', { ascending: false });

        // Only apply filter for "My Creations" mode
        if (filterMode === 'mine' && user) {
          query = query.eq('creator_id', user.id);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching images:', error);
          return;
        }
        
        if (data) {
          console.log('Fetched data:', data);
          // Map the data directly since URLs should already be public
          const imagesWithData = data.map(img => ({
            id: img.id,
            url: img.url,  // Use the stored URL directly
            prompt: img.prompt,
            likes: img.likes || 0,
            creator_id: img.creator_id,
            creator_name: img.creator_name
          }));
          setImages(imagesWithData);
        } else {
          console.log('No data returned from query');
          setImages([]);
        }
      } catch (error) {
        console.error('Error in fetchImages:', error);
      }
    }

    fetchImages();
  }, [filterMode, user]);

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to generate images')
      return
    }
    
    if (!prompt) return
    
    setIsGenerating(true)
    try {
      const generatedImage = await generateSvg(prompt)
      if (generatedImage) {
        const imageToSave = {
          url: generatedImage.url,
          prompt: generatedImage.prompt,
          likes: 0,
          creator_id: user.id,
          creator_name: user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || 'anonymous',
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('generated_images')
          .insert([imageToSave])
          .select()
          .single();

        if (error) {
          console.error('Error saving to Supabase:', error);
          throw error;
        }

        setImages(prev => [data, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error('Failed to generate or save SVG:', error)
      toast.error('Failed to generate SVG')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const saveSVG = async (svgData: string) => {
    try {
      if (!user) {
        throw new Error('Must be logged in to save SVGs')
      }

      // Generate a unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Upload to storage bucket
      const { path, url } = await uploadSvg(svgData, fileName)
      
      // Save reference in database
      const { data, error } = await supabase
        .from('saved_svgs')
        .insert([
          {
            svg_data: path,
            svg_url: url,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      console.log('SVG saved successfully:', data)
      return data
    } catch (error) {
      console.error('Error saving SVG:', error)
      throw error
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      marginTop: '60px'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '600px',
        marginBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {isGenerating && (
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: 0,
            right: 0
          }}>
            <Progress 
              value={progress} 
              className="h-[2px] w-full bg-transparent"
            />
          </div>
        )}
        <Input
          style={{
            width: '100%',
            height: '56px',
            padding: '0 24px',
            fontSize: '16px',
            borderRadius: '16px',
            border: '2px solid rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}
          placeholder={user ? "Enter a prompt to generate an SVG..." : "Sign in to generate SVGs"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating || !user}
        />
        
        <Button
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          style={{
            height: '44px',
            minWidth: '160px',
            borderRadius: '12px',
            background: 'linear-gradient(to right, #4F46E5, #6366F1)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: prompt && !isGenerating ? 'pointer' : 'default',
            opacity: prompt && !isGenerating ? 1 : 0.7,
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>
      
      {user ? (
        <>
          <div style={{
            width: '90%',
            maxWidth: '600px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Button
              onClick={() => setFilterMode('all')}
              variant={filterMode === 'all' ? 'default' : 'outline'}
            >
              All Creations
            </Button>
            <Button
              onClick={() => setFilterMode('mine')}
              variant={filterMode === 'mine' ? 'default' : 'outline'}
            >
              My Creations
            </Button>
          </div>

          <div style={{ width: '100%' }}>
            <ImageGrid images={images} />
          </div>
        </>
      ) : (
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 20px'
        }}>
          <TypeWriter 
            text="Use your imagination, turn your words into a scalable vector graphic with ease." 
            speed={40}
          />
        </div>
      )}
    </div>
  )
} 