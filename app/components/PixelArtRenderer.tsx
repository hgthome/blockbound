'use client';

import React from 'react';
import { PixelArt } from '@/types';

interface PixelArtRendererProps {
  pixelArt: PixelArt;
  size?: number;
  className?: string;
  animate?: boolean;
}

const PixelArtRenderer: React.FC<PixelArtRendererProps> = ({
  pixelArt,
  size = 128,
  className = '',
  animate = false
}) => {
  const { pixels, palette } = pixelArt;
  const pixelSize = size / pixels.length;
  
  return (
    <div 
      className={`relative ${animate ? 'animate-[pixel-bounce_1s_ease-in-out_infinite]' : ''} ${className}`}
      style={{ 
        width: size, 
        height: size,
        imageRendering: 'pixelated'
      }}
    >
      {pixels.map((row, y) => (
        row.map((colorIndex, x) => (
          colorIndex > 0 && (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                top: y * pixelSize,
                left: x * pixelSize,
                width: pixelSize,
                height: pixelSize,
                backgroundColor: palette[colorIndex],
              }}
            />
          )
        ))
      ))}
    </div>
  );
};

export default PixelArtRenderer; 