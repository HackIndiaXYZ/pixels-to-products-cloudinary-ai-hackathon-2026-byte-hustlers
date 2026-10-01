'use client';

import React, { useState } from 'react';
import { Gamepad2, Shield, Heart, Zap, Sparkles, Sword } from 'lucide-react';

interface GameHudSimulatorProps {
  imageUrl: string;
  assetName: string;
  assetType: string;
}

export default function GameHudSimulator({ imageUrl, assetName, assetType }: GameHudSimulatorProps) {
  const [hudMode, setHudMode] = useState<'rpg_inventory' | 'cyberpunk_hud' | 'dialogue_box' | 'pubg_br_hud'>('pubg_br_hud');

  return (
    <div className="w-full space-y-4">
      {/* HUD MODE SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <Gamepad2 className="w-4 h-4" />
          <span>In-Game UI Sandbox Simulator</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHudMode('pubg_br_hud')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              hudMode === 'pubg_br_hud'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            🪂 PUBG / Free Fire BR HUD
          </button>

          <button
            onClick={() => setHudMode('cyberpunk_hud')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              hudMode === 'cyberpunk_hud'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Cyberpunk Action HUD
          </button>

          <button
            onClick={() => setHudMode('rpg_inventory')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              hudMode === 'rpg_inventory'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            RPG Inventory Grid
          </button>

          <button
            onClick={() => setHudMode('dialogue_box')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              hudMode === 'dialogue_box'
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            NPC Dialogue Portrait
          </button>
        </div>
      </div>

      {/* CANVAS DISPLAY BOX */}
      <div className="relative w-full h-[380px] rounded-2xl bg-[#090e17] border border-slate-800 flex items-center justify-center p-6 overflow-hidden shadow-2xl">
        
        {/* MODE 0: PUBG / FREE FIRE BATTLE ROYALE HUD */}
        {hudMode === 'pubg_br_hud' && (
          <div className="w-full max-w-2xl bg-slate-950/95 border-2 border-amber-500/60 rounded-2xl p-4 space-y-4 shadow-2xl relative text-xs font-mono">
            
            {/* BR Match Status Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-4">
                <div className="bg-amber-950 px-3 py-1 rounded-lg border border-amber-500/50 text-amber-400 font-black">
                  🪂 ALIVE: 42
                </div>
                <div className="bg-red-950 px-3 py-1 rounded-lg border border-red-500/50 text-red-400 font-black">
                  🎯 KILLS: 9
                </div>
              </div>

              <div className="text-center font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                ZONE SHRINKING IN <span className="text-cyan-400 font-extrabold">00:45</span>
              </div>

              {/* Minimap Circle */}
              <div className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-slate-900 flex items-center justify-center relative overflow-hidden shadow-md">
                <div className="w-6 h-6 rounded-full border border-dashed border-cyan-300 animate-spin" />
                <div className="w-2 h-2 rounded-full bg-amber-400 absolute" />
              </div>
            </div>

            {/* Main Battle Feed & Asset Display */}
            <div className="grid grid-cols-12 gap-4 items-center">
              
              {/* Asset Equipped Card */}
              <div className="col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-amber-950/50 border border-amber-500/50 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={assetName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('/api/image-proxy') && imageUrl.startsWith('http')) {
                        target.src = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
                      } else {
                        target.src = '/assets/renders/cyberwarrior.jpg';
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs truncate">{assetName}</h4>
                  <span className="text-[10px] text-amber-400 font-bold block">LEVEL 3 HELMET & VEST</span>
                  <span className="text-[9px] text-slate-400">PUBG/Free Fire Skin Active</span>
                </div>
              </div>

              {/* Live Kill Feed */}
              <div className="col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1 text-[10px]">
                <div className="text-slate-400 font-bold text-[9px] border-b border-slate-800 pb-1 flex justify-between">
                  <span>LIVE BATTLE FEED</span>
                  <span className="text-amber-400">ERANGEL / MAP 01</span>
                </div>
                <div className="text-red-400 flex justify-between">
                  <span>💥 [AWM] Player13 → ShadowSniper</span>
                  <span>240m</span>
                </div>
                <div className="text-emerald-400 flex justify-between font-bold">
                  <span>🎯 [AWM] {assetName} → CyberBot_09</span>
                  <span>Headshot!</span>
                </div>
              </div>

            </div>

            {/* Bottom Bar: Health, Ammo & Equipment */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              
              {/* Health & Durability */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>❤️ HEALTH: 100/100</span>
                  <span className="text-emerald-400">MEDKIT x2</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
                <div className="flex gap-2 text-[10px] text-slate-400">
                  <span className="text-cyan-400">🛡️ L3 Vest: 92%</span>
                  <span className="text-amber-400">🪖 L3 Helmet: 88%</span>
                </div>
              </div>

              {/* Weapon Ammo Slots */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-between text-[11px]">
                <div>
                  <div className="font-extrabold text-amber-400">SLOT 1: AWM SNIPER</div>
                  <div className="text-[10px] text-slate-400">8x Scope • Suppressor</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-white">5 / 45</div>
                  <div className="text-[9px] text-cyan-400 font-bold">.300 MAGNUM</div>
                </div>
              </div>

            </div>

          </div>
        )}
        
        {/* MODE 1: CYBERPUNK ACTION HUD */}
        {hudMode === 'cyberpunk_hud' && (
          <div className="w-full max-w-xl bg-slate-950/90 border-2 border-cyan-500/50 rounded-2xl p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-cyan-950 border border-cyan-500/60 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={assetName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('/api/image-proxy') && imageUrl.startsWith('http')) {
                        target.src = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
                      } else {
                        target.src = '/assets/renders/cyberwarrior.jpg';
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{assetName}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono">STATUS: ACTIVE HERO (LEVEL 99)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-500/40">
                CYBER-ENGINE 2099
              </span>
            </div>

            {/* Health & Energy Bars */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> HP: 2,450 / 2,450
                </span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full w-full" />
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> PLASMA ENERGY
                </span>
                <span className="text-cyan-400 font-bold">85%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-400 h-full w-[85%]" />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: RPG INVENTORY GRID */}
        {hudMode === 'rpg_inventory' && (
          <div className="w-full max-w-lg bg-slate-950/95 border-2 border-purple-500/50 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
              <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
                Mythic Inventory Slot
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                LEGENDARY RARITY
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="col-span-1 aspect-square rounded-2xl bg-purple-950/40 border-2 border-purple-400 p-2 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <img
                  src={imageUrl}
                  alt={assetName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/api/image-proxy') && imageUrl.startsWith('http')) {
                      target.src = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
                    } else {
                      target.src = '/assets/renders/cyberwarrior.jpg';
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="col-span-2 space-y-2 text-xs">
                <h4 className="font-extrabold text-white text-sm">{assetName}</h4>
                <p className="text-[11px] text-slate-300 italic">&quot;Cloudinary AI processed item asset ready for equipment.&quot;</p>

                <div className="space-y-1 pt-1 font-mono text-[11px] text-purple-300">
                  <p>⚔️ ATK Power: +450</p>
                  <p>🛡️ Armor Defense: +320</p>
                  <p>✨ Cloudinary Optimization: 100%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: NPC DIALOGUE PORTRAIT */}
        {hudMode === 'dialogue_box' && (
          <div className="w-full max-w-xl bg-slate-950/95 border-2 border-pink-500/50 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-2xl bg-pink-950 border-2 border-pink-400 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg shadow-pink-500/20">
                <img
                  src={imageUrl}
                  alt={assetName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/api/image-proxy') && imageUrl.startsWith('http')) {
                      target.src = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
                    } else {
                      target.src = '/assets/renders/cyberwarrior.jpg';
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-base">{assetName}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40 font-mono">
                    NPC SPEAKS
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                  &quot;Welcome, adventurer! This visual asset was dynamically background-removed and smart-cropped by Cloudinary&apos;s AI pipeline in under 200ms.&quot;
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
