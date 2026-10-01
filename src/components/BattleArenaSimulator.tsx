'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, Trophy, Heart, Zap, RefreshCcw, Shield, Swords } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleArenaSimulatorProps {
  imageUrl: string;
  assetName: string;
}

export default function BattleArenaSimulator({ imageUrl, assetName }: BattleArenaSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [aliveCount, setAliveCount] = useState(100);
  const [health, setHealth] = useState(100);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      vx: 0,
      vy: 0,
      speed: 4
    };

    const keys: Record<string, boolean> = {};

    interface Bullet {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    interface Bot {
      id: number;
      x: number;
      y: number;
      radius: number;
      speed: number;
      hp: number;
    }

    let bullets: Bullet[] = [];
    let bots: Bot[] = [];

    // Spawn initial bot wave
    const spawnBots = () => {
      for (let i = 0; i < 6; i++) {
        bots.push({
          id: Math.random(),
          x: Math.random() * (canvas.width - 60) + 30,
          y: Math.random() * (canvas.height - 60) + 30,
          radius: 16,
          speed: 1.2 + Math.random() * 0.8,
          hp: 100
        });
      }
    };

    spawnBots();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onerror = () => {
      if (!img.src.includes('/api/image-proxy') && imageUrl.startsWith('http')) {
        img.src = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      } else {
        img.src = '/assets/renders/cyberwarrior.jpg';
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      // Shoot bullet on SPACE / F / Mouse
      if ([' ', 'f', 'z', 'control'].includes(e.key.toLowerCase())) {
        bullets.push({
          x: player.x,
          y: player.y,
          vx: 12,
          vy: 0
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const angle = Math.atan2(clickY - player.y, clickX - player.x);
      bullets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 14,
        vy: Math.sin(angle) * 14
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleCanvasClick);

    const gameLoop = () => {
      player.vx = 0;
      player.vy = 0;

      if (keys['w'] || keys['arrowup']) player.vy = -player.speed;
      if (keys['s'] || keys['arrowdown']) player.vy = player.speed;
      if (keys['a'] || keys['arrowleft']) player.vx = -player.speed;
      if (keys['d'] || keys['arrowright']) player.vx = player.speed;

      player.x += player.vx;
      player.y += player.vy;

      // Keep player inside arena
      if (player.x < player.radius) player.x = player.radius;
      if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;
      if (player.y < player.radius) player.y = player.radius;
      if (player.y > canvas.height - player.radius) player.y = canvas.height - player.radius;

      // Update Bullets
      bullets = bullets.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;
        return b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height;
      });

      // Update Bots & Collisions
      bots.forEach((bot) => {
        const angle = Math.atan2(player.y - bot.y, player.x - bot.x);
        bot.x += Math.cos(angle) * bot.speed;
        bot.y += Math.sin(angle) * bot.speed;

        // Bullet hits Bot
        bullets.forEach((bullet) => {
          const dx = bullet.x - bot.x;
          const dy = bullet.y - bot.y;
          if (Math.sqrt(dx * dx + dy * dy) < bot.radius + 6) {
            bot.hp -= 50;
            bullet.x = -999; // destroy bullet
            if (bot.hp <= 0) {
              setScore((s) => s + 250);
              setKills((k) => k + 1);
              setAliveCount((a) => Math.max(1, a - 1));
              confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
            }
          }
        });
      });

      // Filter dead bots & respawn
      bots = bots.filter((b) => b.hp > 0);
      if (bots.length < 4) spawnBots();

      // Render Arena Canvas
      ctx.fillStyle = '#070c18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Pattern
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Safe Zone Shrinking Ring
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Bullets
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw Enemy Bots
      bots.forEach((bot) => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, bot.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      });

      // Draw Player Asset Icon
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;

      if (img.complete && img.naturalWidth !== 0) {
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [gameStarted, imageUrl]);

  return (
    <div className="w-full space-y-4">
      {/* ARENA HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Swords className="w-4 h-4" />
          <span>PUBG / Free Fire 3D Battle Arena Engine</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-amber-400 font-bold">🪂 ALIVE: {aliveCount}</span>
          <span className="text-red-400 font-bold">🎯 KILLS: {kills}</span>
          <span className="text-cyan-400 font-bold">SCORE: {score}</span>
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div className="relative w-full h-[360px] rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <Swords className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Live Battle Royale Arena Simulator</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Control <strong className="text-amber-400">{assetName}</strong> in a 100-player Battle Royale arena against enemy AI bots!
              </p>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START BATTLE ROYALE MATCH 🪂</span>
            </button>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            className="w-full h-full object-cover cursor-crosshair"
          />
        )}
      </div>

      {/* CONTROLS GUIDE */}
      {gameStarted && (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span>🎮 <strong>Controls:</strong> WASD to move • Left Click or SPACE to shoot ammo</span>
          <button
            onClick={() => {
              setKills(0);
              setScore(0);
              setAliveCount(100);
            }}
            className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Restart Match
          </button>
        </div>
      )}
    </div>
  );
}
