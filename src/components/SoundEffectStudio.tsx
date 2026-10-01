'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Download, Sparkles, Sliders, Music, Radio, Check, Copy, Zap, Shield, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SoundEffectStudioProps {
  assetName: string;
}

export default function SoundEffectStudio({ assetName }: SoundEffectStudioProps) {
  const [soundType, setSoundType] = useState<'gunshot' | 'repulsor' | 'explosion' | 'shield' | 'spell' | 'victory'>('repulsor');
  const [pitch, setPitch] = useState(1.0);
  const [duration, setDuration] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Web Audio API Synthesizer
  const playSynthesizedSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      setIsPlaying(true);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (soundType === 'gunshot') {
        // High frequency transient pop dropping to sub bass
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + duration);

        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (soundType === 'repulsor') {
        // Charging cyan plasma laser sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + duration * 0.5);
        osc.frequency.exponentialRampToValueAtTime(300 * pitch, now + duration);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (soundType === 'explosion') {
        // Noise explosion
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + duration);

        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (soundType === 'shield') {
        // Resonant protective chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(880 * pitch, now + duration);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (soundType === 'spell') {
        // Dragon chi magic swell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 * pitch, now);
        osc.frequency.linearRampToValueAtTime(600 * pitch, now + duration * 0.5);
        osc.frequency.linearRampToValueAtTime(200 * pitch, now + duration);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else {
        // Victory Royale airhorn brass tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(466 * pitch, now);
        osc.frequency.setValueAtTime(587 * pitch, now + 0.2);

        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      }

      osc.start(now);
      osc.stop(now + duration);

      setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
    } catch (e) {
      console.error('Audio synthesis error', e);
      setIsPlaying(false);
    }
  };

  const handleDownloadWav = () => {
    confetti({ particleCount: 50, spread: 50 });
    // Export simulation notification
    alert(`Downloaded synthesized ${soundType}_${assetName.toLowerCase().replace(/\s+/g, '_')}.wav audio file!`);
  };

  const codeSnippet = `// 🔊 GameForge AI — Unity / Unreal Engine Spatial 3D Audio Loader
// Generated for asset: ${assetName} (Sound FX: ${soundType.toUpperCase()})

using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class GameAssetAudioFX : MonoBehaviour {
    [SerializeField] private AudioClip ${soundType}SFX;
    private AudioSource audioSource;

    void Start() {
        audioSource = GetComponent<AudioSource>();
        audioSource.spatialBlend = 1.0f; // Full 3D Spatial Audio
        audioSource.pitch = ${pitch}f;
    }

    public void PlayAssetSFX() {
        audioSource.PlayOneShot(${soundType}SFX);
    }
}`;

  return (
    <div className="w-full space-y-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI Spatial Audio & SFX Generator Engine</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            Real-Time 3D Game Sound FX Studio
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Synthesize and export custom 3D spatial audio for <strong className="text-amber-400">{assetName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playSynthesizedSound}
            disabled={isPlaying}
            className={`px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2.5 transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 shadow-amber-500/25'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isPlaying ? 'PLAYING SFX...' : '🔊 TEST PLAY SOUND'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadWav}
            className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-extrabold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export .WAV</span>
          </motion.button>
        </div>
      </div>

      {/* SOUND TYPE PRESETS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'gunshot', label: '🔫 AWM Gunshot', desc: 'Heavy Battle Royale Fire' },
          { id: 'repulsor', label: '⚡ Unibeam Laser', desc: 'Stark Arc Repulsor Sweep' },
          { id: 'explosion', label: '💥 Frag Explosion', desc: 'Granular Impact Detonation' },
          { id: 'shield', label: '🛡️ Level 3 Shield', desc: 'Resonant Protection Chime' },
          { id: 'spell', label: '🐉 Dragon Chi', desc: 'Ancestral Magic Swell' },
          { id: 'victory', label: '🏆 Victory Airhorn', desc: 'Battle Royale Winner Tone' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSoundType(item.id as typeof soundType)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              soundType === item.id
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-extrabold shadow-lg'
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white">{item.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* SYNTHESIS SLIDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" /> PITCH MULTIPLIER: {pitch.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400" /> DURATION: {duration.toFixed(2)}s
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* CODE EXPORTER */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <span className="font-bold text-amber-400 flex items-center gap-2">
            <Music className="w-4 h-4" /> 3D SPATIAL AUDIO C# CODE
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeSnippet);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <pre className="font-mono text-xs text-slate-300 pt-3 leading-relaxed overflow-x-auto">
          {codeSnippet}
        </pre>
      </div>

    </div>
  );
}
