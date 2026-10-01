'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiggsfieldMotionType,
  HiggsfieldMotionResult,
  HIGGSFIELD_MOTION_PRESETS,
} from '@/lib/higgsfield';
import { Play, Pause, Sparkles, Camera, Copy, Check, Zap, Cpu, ExternalLink, RefreshCw, Film } from 'lucide-react';

interface HiggsfieldMotionStudioProps {
  assetName: string;
  originalImageUrl: string;
}

export default function HiggsfieldMotionStudio({ assetName, originalImageUrl }: HiggsfieldMotionStudioProps) {
  const [selectedMotion, setSelectedMotion] = useState<HiggsfieldMotionType>('idle_anim');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const selectedPreset = HIGGSFIELD_MOTION_PRESETS.find(p => p.id === selectedMotion) || HIGGSFIELD_MOTION_PRESETS[0];

  const presetIcons: Record<HiggsfieldMotionType, React.ElementType> = {
    idle_anim: Film,
    attack_slash: Zap,
    walk_cycle: Play,
    camera_orbit: Camera,
    hero_cinematic: Sparkles,
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedPreset.motionPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // 2.5D Motion Animations tailored for each camera preset
  const getMotionAnimation = () => {
    if (!isPlaying) return {};

    switch (selectedMotion) {
      case 'idle_anim':
        return {
          y: [0, -8, 0, 4, 0],
          scale: [1, 1.02, 1, 0.99, 1],
          transition: { duration: 3 / speedMultiplier, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'attack_slash':
        return {
          x: [0, -15, 25, -8, 0],
          y: [0, 8, -12, 4, 0],
          rotate: [0, -4, 6, -2, 0],
          scale: [1, 0.95, 1.15, 1.02, 1],
          transition: { duration: 1.8 / speedMultiplier, repeat: Infinity, ease: 'backInOut' as const },
        };
      case 'walk_cycle':
        return {
          x: [-12, 12, -12],
          y: [0, -10, 0, -10, 0],
          rotate: [-3, 3, -3],
          transition: { duration: 2.2 / speedMultiplier, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'camera_orbit':
        return {
          rotateY: [0, 25, 0, -25, 0],
          rotateX: [0, -8, 0, 8, 0],
          scale: [1, 1.04, 1, 1.04, 1],
          transition: { duration: 4 / speedMultiplier, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'hero_cinematic':
        return {
          y: [20, -10, 0],
          scale: [0.9, 1.08, 1.02],
          filter: [
            'brightness(0.7) contrast(1.2)',
            'brightness(1.25) contrast(1.1)',
            'brightness(1) contrast(1)',
          ],
          transition: { duration: 3.5 / speedMultiplier, repeat: Infinity, ease: 'easeOut' as const },
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* TOP CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Cpu className="w-4 h-4" />
          <span>Higgsfield AI Motion Studio • 2.5D Camera Shaders</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-cyan-500/30">
            Live Asset Animation
          </span>
          <a
            href="https://higgsfield.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-400 transition-colors ml-2"
          >
            <ExternalLink className="w-3 h-3" />
            higgsfield.ai
          </a>
        </div>
      </div>

      {/* PRESET BUTTONS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {HIGGSFIELD_MOTION_PRESETS.map((preset) => {
          const Icon = presetIcons[preset.id];
          const isSelected = selectedMotion === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedMotion(preset.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-white line-clamp-1">{preset.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</p>
            </button>
          );
        })}
      </div>

      {/* 2.5D INTERACTIVE MOTION VIEWPORT */}
      <div className="relative w-full min-h-[400px] rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-2xl p-6 [perspective:1000px]">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        {/* Dynamic Glow Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Animated Asset Frame */}
        <motion.div
          key={`${selectedMotion}-${isPlaying}-${speedMultiplier}`}
          animate={getMotionAnimation()}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative z-10 flex items-center justify-center max-h-[300px]"
        >
          <img
            src={originalImageUrl}
            alt={assetName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('/api/image-proxy') && originalImageUrl.startsWith('http')) {
                target.src = `/api/image-proxy?url=${encodeURIComponent(originalImageUrl)}`;
              } else {
                target.src = '/assets/renders/cyberwarrior.jpg';
              }
            }}
            className="max-h-[300px] object-contain rounded-2xl shadow-2xl drop-shadow-[0_15px_30px_rgba(6,182,212,0.25)]"
          />

          {/* Speed-line overlay during attack slash */}
          {selectedMotion === 'attack_slash' && isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse pointer-events-none rounded-2xl" />
          )}
        </motion.div>

        {/* Ground shadow oscillation */}
        <motion.div
          animate={{
            scale: selectedMotion === 'idle_anim' ? [1, 1.15, 1] : [0.9, 1.2, 0.9],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2.5 / speedMultiplier, repeat: Infinity, ease: 'easeInOut' }}
          className="w-48 h-4 bg-cyan-500/20 blur-md rounded-full mt-4"
        />

        {/* BOTTOM METADATA & TELEMETRY BAR */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all font-bold flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-500 px-1.5">Speed:</span>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    speedMultiplier === s
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Preset: <strong className="text-white">{selectedPreset.cameraPreset}</strong>
            </span>
            <button
              onClick={handleCopyPrompt}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Motion Prompt'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

