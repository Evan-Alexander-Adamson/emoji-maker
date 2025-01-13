'use client'

import { useState, useEffect } from 'react'
import { Space_Mono } from 'next/font/google'

// Import Space Mono font for typewriter effect
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
})

interface TypeWriterProps {
  text: string
  speed?: number
}

export function TypeWriter({ text, speed = 50 }: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  return (
    <div className="flex flex-col items-center gap-4">
      <span className={`${spaceMono.className} text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight leading-relaxed max-w-4xl text-center`}>
        {displayText}
        <span className="animate-pulse text-indigo-600">|</span>
      </span>
    </div>
  )
} 