'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Sliders, Sun, Shield, Sparkles, Copy, Check, Eye, Cpu, Code, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UnrealUnityStudioProps {
  originalImageUrl: string;
  assetName: string;
}

export default function UnrealUnityStudio({ originalImageUrl, assetName }: UnrealUnityStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [wireframe, setWireframe] = useState(false);
  const [metallic, setMetallic] = useState(0.8);
  const [roughness, setRoughness] = useState(0.2);
  const [normalIntensity, setNormalIntensity] = useState(1.5);
  const [lightAngle, setLightAngle] = useState(45);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'ue5_cpp' | 'unity_cs' | 'hlsl'>('ue5_cpp');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImageUrl;

    const render3DSphere = () => {
      rotation += 0.01;

      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      if (img.complete && img.naturalWidth !== 0) {
        ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      }

      // Draw PBR Metallic & Light Shader Overlay
      const rad = (lightAngle * Math.PI) / 180;
      const lightX = centerX + Math.cos(rad + rotation) * radius * 0.8;
      const lightY = centerY + Math.sin(rad + rotation) * radius * 0.8;

      const pbrGrad = ctx.createRadialGradient(lightX, lightY, 5, centerX, centerY, radius);
      pbrGrad.addColorStop(0, `rgba(255, 255, 255, ${0.4 + metallic * 0.5})`);
      pbrGrad.addColorStop(0.4, `rgba(6, 182, 212, ${0.2 + (1 - roughness) * 0.3})`);
      pbrGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

      ctx.fillStyle = pbrGrad;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Draw Sphere Outer Ring Light
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = metallic > 0.5 ? '#06b6d4' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Wireframe mode
      if (wireframe) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1;
        for (let r = 20; r <= radius; r += 20) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(a + rotation) * radius, centerY + Math.sin(a + rotation) * radius);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render3DSphere);
    };

    render3DSphere();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [originalImageUrl, metallic, roughness, lightAngle, wireframe]);

  const ue5Code = `// 🎮 Unreal Engine 5 — PBR Lumen Shader & Material Instance Setup
// Asset: ${assetName} (PBR Metallic: ${metallic}, Roughness: ${roughness})

#pragma once
#include "CoreMinimal.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "GameFramework/Actor.h"
#include "UE5PBRAsset.generated.h"

UCLASS()
class MYGAME_API AUE5PBRAsset : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "GameForge PBR Shader")
    UMaterialInterface* BasePBRMaterial;

    UPROPERTY(VisibleAnywhere, Category = "GameForge PBR Shader")
    UMaterialInstanceDynamic* DynamicMaterialInstance;

    virtual void BeginPlay() override
    {
        Super::BeginPlay();
        if (BasePBRMaterial)
        {
            DynamicMaterialInstance = UMaterialInstanceDynamic::Create(BasePBRMaterial, this);
            DynamicMaterialInstance->SetScalarParameterValue(FName("Metallic"), ${metallic}f);
            DynamicMaterialInstance->SetScalarParameterValue(FName("Roughness"), ${roughness}f);
            DynamicMaterialInstance->SetScalarParameterValue(FName("NormalIntensity"), ${normalIntensity}f);
            UE_LOG(LogTemp, Log, TEXT("[GameForge UE5 PBR] Initialized PBR Shader for ${assetName}"));
        }
    }
};`;

  const unityCode = `// 🎮 Unity Engine 2026 — PBR Universal Render Pipeline (URP) Material Importer
// Asset: ${assetName} (PBR Metallic: ${metallic}, Roughness: ${roughness})

using UnityEngine;

public class UnityURPMaterialSetup : MonoBehaviour {
    [SerializeField] private Material targetPBRMaterial;
    [SerializeField] private Texture2D albedoTexture;
    [SerializeField] private Texture2D normalMap;

    void Start() {
        if (targetPBRMaterial != null) {
            targetPBRMaterial.SetFloat("_Metallic", ${metallic}f);
            targetPBRMaterial.SetFloat("_Glossiness", ${1 - roughness}f);
            targetPBRMaterial.SetFloat("_BumpScale", ${normalIntensity}f);
            Debug.Log("[GameForge Unity URP] Applied PBR Material parameters to ${assetName}");
        }
    }
}`;

  return (
    <div className="w-full space-y-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Unreal Engine 5 & Unity PBR Shader Studio</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            Real-Time 3D PBR Material & Mesh Inspector
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Inspect PBR material maps and export UE5 Lumen / Unity URP shaders for <strong className="text-cyan-400">{assetName}</strong>.
          </p>
        </div>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
            wireframe
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{wireframe ? 'Wireframe Mesh ON' : 'Toggle 3D Wireframe'}</span>
        </button>
      </div>

      {/* 3D CANVAS & SLIDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Display */}
        <div className="lg:col-span-6 relative bg-slate-950 rounded-2xl border border-slate-800 h-64 flex items-center justify-center overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} width={450} height={256} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold">
            UE5 LUMEN REAL-TIME RAYTRACED PBR SHADER
          </div>
        </div>

        {/* Sliders */}
        <div className="lg:col-span-6 space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>METALLIC GLOSS: {(metallic * 100).toFixed(0)}%</span>
              <span className="text-cyan-400">PBR Reflection</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={metallic}
              onChange={(e) => setMetallic(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>SURFACE ROUGHNESS: {(roughness * 100).toFixed(0)}%</span>
              <span className="text-purple-400">Micro-Surface</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>NORMAL MAP BUMP INTENSITY: {normalIntensity.toFixed(1)}x</span>
              <span className="text-amber-400">Depth Relief</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={normalIntensity}
              onChange={(e) => setNormalIntensity(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>DYNAMIC LIGHT ANGLE: {lightAngle}°</span>
              <span className="text-emerald-400">Sun Orbit</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={lightAngle}
              onChange={(e) => setLightAngle(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* SHADER CODE EXPORTER */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <button
              onClick={() => setActiveCodeTab('ue5_cpp')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                activeCodeTab === 'ue5_cpp' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'text-slate-400 border-transparent'
              }`}
            >
              Unreal Engine 5 C++
            </button>
            <button
              onClick={() => setActiveCodeTab('unity_cs')}
              className={`px-3 py-1 rounded-lg border transition-all ${
                activeCodeTab === 'unity_cs' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'text-slate-400 border-transparent'
              }`}
            >
              Unity URP C#
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(activeCodeTab === 'ue5_cpp' ? ue5Code : unityCode);
              setCopiedCode(true);
              confetti({ particleCount: 50, spread: 50 });
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <pre className="font-mono text-xs text-slate-300 pt-3 leading-relaxed overflow-x-auto">
          {activeCodeTab === 'ue5_cpp' ? ue5Code : unityCode}
        </pre>
      </div>

    </div>
  );
}
