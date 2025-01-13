'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface EmojiGeneratorProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function EmojiGenerator({ onGenerate, isLoading }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate emoji');
        }

        const data = await response.json();
        // Handle the response data
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Enter a prompt to generate an emoji"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>
    </Card>
  );
} 