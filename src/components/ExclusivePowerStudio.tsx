'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GameAsset, ExclusivePower } from '@/types/gameforge';
import { getAssetExclusivePower } from '@/lib/mock-data';
import { Zap, Shield, Flame, Sparkles, Copy, Check, Terminal, Play, RotateCcw, Swords, Cpu, Activity, Award } from 'lucide-react';

interface ExclusivePowerStudioProps {
  asset: GameAsset;
}

export default function ExclusivePowerStudio({ asset }: ExclusivePowerStudioProps) {
  const power: ExclusivePower = asset.exclusivePower || getAssetExclusivePower(asset);

  const [isActivating, setIsActivating] = useState(false);
  const [powerLogs, setPowerLogs] = useState<string[]>([]);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const [activeCodeEngine, setActiveCodeEngine] = useState<'unity' | 'unreal' | 'godot'>('unity');
  const [copiedCode, setCopiedCode] = useState(false);

  // Battle simulator state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dummiesDestroyed, setDummiesDestroyed] = useState(0);

  const triggerPowerAnimation = () => {
    if (isActivating) return;
    setIsActivating(true);

    // 1. Confetti burst with asset color
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: [power.particleFXColor, '#06b6d4', '#f59e0b', '#ffffff']
    });

    // 2. Compute damage output
    const calculatedDamage = Math.floor(Math.random() * 2500) + 4500;
    setDamageDealt(calculatedDamage);
    setDummiesDestroyed((d) => d + 3);

    const logEntry = `[${new Date().toLocaleTimeString()}] ⚡ UNLEASHED ${power.powerName.toUpperCase()}! Dealt ${calculatedDamage} ${power.elementAffinity} damage!`;
    setPowerLogs((prev) => [logEntry, ...prev]);

    // 3. Draw power beam on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        ctx.fillStyle = '#0b1329';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Player asset icon/glow
        ctx.shadowColor = power.particleFXColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = power.particleFXColor;
        ctx.beginPath();
        ctx.arc(60, canvas.height / 2, 28, 0, Math.PI * 2);
        ctx.fill();

        // Draw Power Beam / Shockwave
        const gradient = ctx.createLinearGradient(80, 0, canvas.width - 40, 0);
        gradient.addColorStop(0, power.particleFXColor);
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(88, canvas.height / 2 - 25, canvas.width - 120, 50);

        // Draw target dummy explosions
        for (let i = 0; i < 4; i++) {
          const exX = 180 + i * 110;
          const exY = canvas.height / 2 + (Math.random() * 40 - 20);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(exX, exY, 20, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    }

    setTimeout(() => {
      setIsActivating(false);
    }, 1800);
  };

  const handleCopyCode = () => {
    let snippet = power.unityCodeSnippet;
    if (activeCodeEngine === 'unreal') snippet = power.unrealCodeSnippet;
    if (activeCodeEngine === 'godot') snippet = power.godotCodeSnippet;

    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Exclusive Asset Power System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span>{power.powerName}</span>
            <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 uppercase tracking-wider">
              {power.powerType}
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {power.description}
          </p>
        </div>

        {/* UNLEASH POWER BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerPowerAnimation}
          disabled={isActivating}
          className={`px-6 py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-xl flex items-center gap-3 transition-all ${
            isActivating
              ? 'bg-amber-500 text-slate-950 animate-bounce'
              : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>{isActivating ? '⚡ UNLEASHING POWER...' : '⚡ UNLEASH EXCLUSIVE POWER'}</span>
        </motion.button>
      </div>

      {/* POWER STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Power Level */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>POWER LEVEL</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{power.powerLevel} / 100</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-cyan-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${power.powerLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mana Cost */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MANA COST</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-cyan-400">{power.manaCost} MP</div>
            <div className="text-xs text-slate-500 mt-1">Cooldown: {power.cooldownSeconds}s</div>
          </div>
        </div>

        {/* Damage Multiplier */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>DAMAGE OUTPUT</span>
            <Swords className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-extrabold text-red-400 leading-tight">{power.damageMultiplier}</div>
            <div className="text-xs text-slate-500 mt-1">Affinity: {power.elementAffinity}</div>
          </div>
        </div>

        {/* Passive Buff */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>PASSIVE BUFF</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-emerald-400 leading-tight">{power.passiveBuff}</div>
            <div className="text-xs text-slate-500 mt-1">Always Active</div>
          </div>
        </div>

      </div>

      {/* INTERACTIVE BATTLE SIMULATOR */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-cyan-400 fill-current" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Ability Simulator Sandbox
            </h3>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Dummies Vaporized: <span className="text-cyan-400 font-bold">{dummiesDestroyed}</span>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0b1329] h-48 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={700}
            height={192}
            className="w-full h-full object-cover"
          />

          {!damageDealt && !isActivating && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
              <Zap className="w-8 h-8 text-cyan-400 animate-bounce mb-2" />
              <p className="text-sm font-bold text-white">Click &quot;Unleash Exclusive Power&quot; Above</p>
              <p className="text-xs text-slate-400 mt-1">Simulate real-time particle beam & damage output against enemy target bots.</p>
            </div>
          )}

          {/* Floating Damage Popup */}
          <AnimatePresence>
            {damageDealt && isActivating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1.2, y: -20 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute font-black text-3xl sm:text-4xl text-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)] tracking-wider"
              >
                💥 +{damageDealt} CRITICAL DAMAGE!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* POWER LOG & CODE EXPORTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Terminal Log */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-64">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono font-bold text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>EXCLUSIVE POWER EXECUTION LOG</span>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs text-cyan-300/90 space-y-1.5 pt-3">
            {powerLogs.length === 0 ? (
              <div className="text-slate-600 italic">No power activation logs yet. Click unleash power to begin.</div>
            ) : (
              powerLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Engine Code Exporter */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-64">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>GAME ENGINE ABILITY SCRIPT EXPORTER</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-900 rounded-lg p-0.5 text-xs font-semibold border border-slate-800">
                <button
                  onClick={() => setActiveCodeEngine('unity')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeCodeEngine === 'unity' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unity C#
                </button>
                <button
                  onClick={() => setActiveCodeEngine('unreal')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeCodeEngine === 'unreal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unreal C++
                </button>
                <button
                  onClick={() => setActiveCodeEngine('godot')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeCodeEngine === 'godot' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Godot GDScript
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Copy Script"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto pt-3">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              {activeCodeEngine === 'unity' && power.unityCodeSnippet}
              {activeCodeEngine === 'unreal' && power.unrealCodeSnippet}
              {activeCodeEngine === 'godot' && power.godotCodeSnippet}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
