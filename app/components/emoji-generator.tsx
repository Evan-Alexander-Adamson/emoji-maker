"use client";

import { useState } from 'react';

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate emoji');
      }

      const data = await response.json();
      // Handle the successful response here
      console.log(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your emoji..."
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Emoji'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
} 