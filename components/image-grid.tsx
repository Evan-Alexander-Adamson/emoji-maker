'use client'

import { useState, useEffect } from 'react'
import { Download, Heart, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"

interface GeneratedImage {
  id: string
  url: string
  likes: number
  prompt: string
  creator_id?: string
  creator_name?: string
}

interface ImageGridProps {
  images: GeneratedImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set())
  const [imageData, setImageData] = useState<GeneratedImage[]>(images)
  const { user } = useUser();

  useEffect(() => {
    setImageData(images)
  }, [images])

  useEffect(() => {
    async function fetchUserLikes() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('image_likes')
        .select('image_id')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching user likes:', error);
        return;
      }
      
      if (data) {
        setLikedImages(new Set(data.map(like => like.image_id)));
      }
    }

    fetchUserLikes();
  }, [user]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  const handleLike = async (imageId: string) => {
    if (!user) {
      toast.error('Please sign in to like images')
      return;
    }

    try {
      const isLiked = likedImages.has(imageId)
      
      // Update local state immediately for better UX
      setLikedImages(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.delete(imageId)
        } else {
          newSet.add(imageId)
        }
        return newSet
      })

      // Call the toggle_like function with user ID
      const { data, error } = await supabase
        .rpc('like_image', { 
          target_image_id: imageId,
          target_user_id: user.id
        })

      if (error) throw error

      // Update image data with new likes count
      setImageData(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, likes: data } : img
        )
      )
    } catch (error) {
      console.error('Error updating likes:', error)
      toast.error('Failed to update like')
      // Revert local state if error occurs
      setLikedImages(prev => {
        const newSet = new Set(prev)
        if (newSet.has(imageId)) {
          newSet.delete(imageId)
        } else {
          newSet.add(imageId)
        }
        return newSet
      })
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId)
        .eq('creator_id', user.id);

      if (error) throw error;

      // Remove image from local state
      setImageData(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (imageData.length === 0) {
    return (
      <div style={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        width: '100%'
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            aspectRatio: '1',
            backgroundColor: '#EDF2F7',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '40%',
              height: '40%',
              backgroundColor: '#E2E8F0',
              borderRadius: '8px'
            }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '16px',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      width: '100%'
    }}>
      {imageData.map((image) => (
        <div key={image.id} style={{
          position: 'relative',
          aspectRatio: '1',
          backgroundColor: '#EDF2F7',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <img
            src={image.url}
            alt={`Generated SVG: ${image.prompt}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            {image.creator_name ? (
              <>Created by {image.creator_name}</>
            ) : (
              <>Created by Anonymous</>
            )}
          </div>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(190, 227, 248, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
          >
            <button
              onClick={() => handleDownload(image.url)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Download style={{ width: '18px', height: '18px', color: '#2D3748' }} />
            </button>
            <button
              onClick={() => handleLike(image.id)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Heart 
                style={{ 
                  width: '18px', 
                  height: '18px',
                  color: '#2D3748',
                  fill: likedImages.has(image.id) ? '#2D3748' : 'none'
                }} 
              />
              <span style={{ fontSize: '12px', color: '#2D3748' }}>
                {image.likes}
              </span>
            </button>
            {user && image.creator_id === user.id && (
              <button
                onClick={() => handleDelete(image.id)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#FEE2E2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Trash2 style={{ width: '18px', height: '18px', color: '#DC2626' }} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 