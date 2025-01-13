'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import Image from "next/image";

interface SvgGridProps {
  svgs: string[];
  onDownload: (image: string) => void;
  onLike: (index: number) => void;
}

export function SvgGrid({ svgs, onDownload, onLike }: SvgGridProps) {
  if (svgs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No images generated yet. Try generating one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {svgs.map((imageUrl, index) => (
        <Card key={index} className="relative group p-4">
          <div className="w-full aspect-square relative">
            <Image
              src={imageUrl}
              alt={`Generated image ${index + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onDownload(imageUrl)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onLike(index)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 