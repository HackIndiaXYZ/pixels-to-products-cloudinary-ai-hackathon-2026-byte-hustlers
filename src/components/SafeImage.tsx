'use client';

import React, { useState, useEffect } from 'react';
import { getPhotorealistic3DRender } from '@/lib/render-resolver';

export const GAME_FALLBACK_IMAGES: Record<string, string> = {
  character: '/assets/renders/cyberwarrior.jpg',
  warrior: '/assets/renders/kratos.jpg',
  weapon: '/assets/renders/awmsniper.jpg',
  environment: '/assets/renders/cybercity.jpg',
  vehicle: '/assets/renders/offroadbuggy.jpg',
  prop: '/assets/renders/arcreactor.jpg',
  default: '/assets/renders/ironman.jpg',
};

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrcs?: string[];
  category?: 'character' | 'warrior' | 'weapon' | 'environment' | 'vehicle' | 'prop' | 'default';
  aspectRatio?: string;
  containerClassName?: string;
  showShimmer?: boolean;
}

export default function SafeImage({
  src,
  fallbackSrcs = [],
  category = 'default',
  alt = 'GameForge Asset',
  className = '',
  containerClassName = '',
  showShimmer = true,
  onLoad,
  onError,
  ...props
}: SafeImageProps) {
  const defaultFallback = getPhotorealistic3DRender(alt, category);

  const initialSrc = (src && !src.includes('/api/asset-render')) ? src : defaultFallback;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [attemptIndex, setAttemptIndex] = useState(0);

  const allCandidates = [
    src,
    ...fallbackSrcs,
    defaultFallback,
  ].filter(Boolean) as string[];

  // Re-sync if src prop changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const cleanSrc = (src && !src.includes('/api/asset-render')) ? src : defaultFallback;
    setCurrentSrc(cleanSrc);
    setIsLoaded(false);
    setAttemptIndex(0);

    // Watchdog timer: If external image is hanging longer than 3.5 seconds, auto-fallback to local 3D render
    const timer = setTimeout(() => {
      setIsLoaded((loaded) => {
        if (!loaded) {
          setCurrentSrc(defaultFallback);
          return true;
        }
        return loaded;
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [src, defaultFallback]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const nextIndex = attemptIndex + 1;
    if (nextIndex < allCandidates.length) {
      setAttemptIndex(nextIndex);
      setCurrentSrc(allCandidates[nextIndex]);
    } else {
      // Final instant local 3D game render fallback
      setCurrentSrc(defaultFallback);
      setIsLoaded(true);
    }
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Shimmer skeleton until image is fully rendered */}
      {!isLoaded && showShimmer && (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 animate-pulse flex items-center justify-center z-10 pointer-events-none">
          <div className="w-7 h-7 rounded-xl border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        </div>
      )}

      <img
        {...props}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
