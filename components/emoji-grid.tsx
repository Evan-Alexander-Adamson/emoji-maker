'use client';

import { Card } from './ui/card';
import Image from 'next/image';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface EmojiGridProps {
  emojis: string[];
  onLike?: (index: number) => void;
  onDownload?: (url: string) => void;
}

export function EmojiGrid({ emojis, onLike, onDownload }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <Card key={index} className="relative group aspect-square">
          <Image
            src={emoji}
            alt={`Generated emoji ${index + 1}`}
            fill
            className="object-cover p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
              onClick={() => onLike?.(index)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
              onClick={() => onDownload?.(emoji)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 