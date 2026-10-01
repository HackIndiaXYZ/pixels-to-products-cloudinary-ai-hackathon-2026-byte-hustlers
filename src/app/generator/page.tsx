'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AssetType, AssetStyle, AspectRatio, Project, CategoryGroup } from '@/types/gameforge';
import { getStoredProjects, createNewAsset, createAssetPack } from '@/lib/store';
import { enhanceGamePrompt } from '@/lib/prompt-enhancer';
import { Wand2, Sparkles, Layers, PackageCheck, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Zap, RefreshCw, Cpu, AlertTriangle, CloudUpload, Info, Box } from 'lucide-react';

function GeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('project');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Dual mode: 'single' vs 'pack'
  const [generationMode, setGenerationMode] = useState<'single' | 'pack'>('single');

  // Multi-Model Engine choice
  const [generationModel, setGenerationModel] = useState<'auto' | 'cloudinary' | 'pollinations' | 'higgsfield'>('auto');

  // Pillar Selection: 2D ART | 3D ASSET | MEDIA & MARKETING
  const [pillar, setPillar] = useState<CategoryGroup>('2D ART');

  // 3D Engine Export State
  const [polyBudget, setPolyBudget] = useState<'Low-Poly (5k)' | 'Mid-Poly (20k)' | 'AAA High-Poly (50k)'>('Mid-Poly (20k)');
  const [exportFormat, setExportFormat] = useState<'GLTF/GLB' | 'FBX' | 'OBJ' | 'USDZ'>('GLTF/GLB');
  const [autoRetopo, setAutoRetopo] = useState(true);

  // Form State
  const [prompt, setPrompt] = useState('Cyberpunk warrior in glowing cyan and gold nanotech armor, dual energy katanas, rain-soaked Neo-Tokyo, raytraced reflections');
  const [packName, setPackName] = useState('Cyberpunk Warrior Pack');
  const [assetType, setAssetType] = useState<AssetType>('Character');
  const [style, setStyle] = useState<AssetStyle>('3D Game Art');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [realismLevel, setRealismLevel] = useState<'ultra_8k' | 'realistic' | 'cinematic' | 'stylized'>('ultra_8k');

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Cloudinary configuration status (non-blocking)
    fetch('/api/cloudinary-status')
      .then((r) => r.json())
      .then((d: { configured: boolean }) => setCloudinaryConfigured(d.configured))
      .catch(() => setCloudinaryConfigured(false));
  }, []);

  useEffect(() => {
    const projs = getStoredProjects();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(projs);
    if (projs.length > 0) {
      setSelectedProjectId(initialProjectId && projs.some(p => p.id === initialProjectId) ? initialProjectId : projs[0].id);
    }
  }, [initialProjectId]);

  const presetPrompts = [
    'Cyberpunk warrior in glowing cyan and gold nanotech armor, dual energy katanas, rain-soaked Neo-Tokyo, raytraced reflections',
    'Mythic dark dragon lord with volcanic obsidian scales and crystal horns, cinematic cave lair',
    'Iron Man Mark 85 hero in glowing crimson and gold nanotech armor, arc reactor glowing',
    'PUBG Ghillie Suit Tactical Commando Operator with sniper rifle',
    'Free Fire Legendary Golden AWM Dragon Sniper Rifle weapon skin with plasma coils',
    'Master Kung Fu Panda warrior in golden dragon martial arts armor, bamboo forest',
    'Tactical sci-fi heavy mech titan with shoulder plasma cannons, Unreal Engine 5 PBR',
    'Rain-soaked cyberpunk alleyway, towering neon skyscrapers, atmospheric volumetric fog'
  ];

  const generationSteps = [
    'Enhancing prompt with 8K Lumen & PBR shader tags...',
    'Synthesizing ultra-realistic AI visual asset...',
    'Buffering high-res image and validating texture channels...',
    'Syncing with Cloudinary media pipeline & auto-tagging...',
    'Building multi-resolution smart crops & variation matrix...'
  ];

  interface GenerateResult {
    imageUrl: string;
    cloudinaryPublicId: string | null;
    cloudinaryUploaded: boolean;
    optimizedUrl: string | null;
    bgRemovedUrl: string | null;
    tags: string[];
    provider: 'pollinations+cloudinary' | 'pollinations';
  }

  /**
   * Calls the upgraded /api/generate-image route.
   */
  async function generateImage(singlePrompt: string, singleAspectRatio: AspectRatio): Promise<GenerateResult> {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: singlePrompt,
        assetType,
        style,
        aspectRatio: singleAspectRatio,
        model: generationModel === 'pollinations' ? 'turbo' : generationModel,
        realismLevel,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json() as {
      imageUrl: string;
      cloudinaryPublicId: string | null;
      cloudinaryConfigured: boolean;
      optimizedUrl: string | null;
      bgRemovedUrl: string | null;
      tags: string[];
      provider: 'pollinations+cloudinary' | 'pollinations';
    };
    return {
      imageUrl:           data.imageUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      cloudinaryUploaded: data.provider === 'pollinations+cloudinary',
      optimizedUrl:       data.optimizedUrl,
      bgRemovedUrl:       data.bgRemovedUrl,
      tags:               data.tags ?? [],
      provider:           data.provider,
    };
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedProjectId) return;

    setIsGenerating(true);
    setProgressStep(0);
    setGenerationError(null);

    // Advance progress indicator while the real fetch is in flight
    const stepInterval = setInterval(() => {
      setProgressStep(prev => Math.min(prev + 1, generationSteps.length - 2));
    }, 4000);

    try {
      if (generationMode === 'single') {
        const result = await generateImage(prompt, aspectRatio);
        clearInterval(stepInterval);
        setProgressStep(generationSteps.length - 1);

        const newAsset = createNewAsset({
          projectId: selectedProjectId,
          name: `${style} ${assetType}`,
          prompt,
          assetType,
          style,
          aspectRatio,
          imageUrl:           result.imageUrl,
          cloudinaryPublicId: result.cloudinaryPublicId ?? undefined,
          optimizedUrl:       result.optimizedUrl,
          bgRemovedUrl:       result.bgRemovedUrl,
          tags:               result.tags,
          cloudinaryUploaded: result.cloudinaryUploaded,
          provider:           result.provider,
        });
        setIsGenerating(false);
        router.push(`/asset/${newAsset.id}`);
      } else {
        // Asset Pack Mode — generate 3 images in sequence
        const packPrompts = [
          { suffix: 'full body standing stance, game character model', ratio: '1:1' as AspectRatio },
          { suffix: 'headshot hero portrait, character icon', ratio: '1:1' as AspectRatio },
          { suffix: 'character inventory gear icon, small icon', ratio: '1:1' as AspectRatio },
        ];

        const results: GenerateResult[] = [];
        for (const item of packPrompts) {
          const r = await generateImage(`${prompt}, ${item.suffix}`, item.ratio);
          results.push(r);
        }

        clearInterval(stepInterval);
        setProgressStep(generationSteps.length - 1);

        const packAssets = createAssetPack({
          projectId: selectedProjectId,
          packName: packName || 'Game Asset Pack',
          prompt,
          assetType,
          style,
          imageUrls:           results.map((r) => r.imageUrl),
          cloudinaryPublicIds: results.map((r) => r.cloudinaryPublicId ?? undefined),
          optimizedUrls:       results.map((r) => r.optimizedUrl),
          bgRemovedUrls:       results.map((r) => r.bgRemovedUrl),
          tagSets:             results.map((r) => r.tags),
          cloudinaryUploaded:  results[0]?.cloudinaryUploaded ?? false,
          provider:            results[0]?.provider ?? 'pollinations',
        });
        setIsGenerating(false);
        router.push(`/asset/${packAssets[0].id}?pack=true`);
      }
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setGenerationError(msg);
    }
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-3 backdrop-blur-md">
          <Wand2 className="w-4 h-4" />
          <span>AI Game-Asset Factory • Cloudinary Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI Game-Asset Factory
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Transform text prompts into 2D art, 3D meshes, PBR textures, and marketing media for game engines.
        </p>
      </motion.div>

      {/* 8-STAGE FACTORY PIPELINE BAR */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shadow-xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Game-Asset Factory Pipeline</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
            Cloudinary Powered
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono text-[10px]">
          {[
            { step: '1. CREATE', desc: 'Catalog Selection' },
            { step: '2. GENERATE', desc: 'AI Synthesis' },
            { step: '3. VARIATE', desc: 'Armors & Colors' },
            { step: '4. ANALYZE', desc: 'AI Vision Tags' },
            { step: '5. OPTIMIZE', desc: 'f_auto / q_auto' },
            { step: '6. ORGANIZE', desc: 'Smart Packs' },
            { step: '7. EXPORT', desc: 'GLTF / Sprites' },
            { step: '8. ENGINE', desc: 'Unity / Unreal' }
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border transition-all ${
                isGenerating && progressStep === idx
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold animate-pulse'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="font-bold text-white line-clamp-1">{s.step}</div>
              <div className="text-[9px] text-slate-500 line-clamp-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3-PILLAR WORKSPACE SELECTOR */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {[
          { id: '2D ART', label: '2D ART', desc: 'Characters, Sprites, UI, Textures', icon: Layers },
          { id: '3D ASSET', label: '3D ASSETS', desc: '3D Mesh, PBR Maps, GLTF Exports', icon: Box },
          { id: 'MEDIA & MARKETING', label: 'MEDIA & MARKETING', desc: 'Posters, Key Art, Motion Clips', icon: Sparkles }
        ].map((p) => {
          const Icon = p.icon;
          const active = pillar === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPillar(p.id as CategoryGroup);
                if (p.id === '3D ASSET') {
                  setStyle('Unreal Engine 5 PBR');
                  setAssetType('Character');
                } else if (p.id === 'MEDIA & MARKETING') {
                  setAssetType('Marketing Art');
                  setAspectRatio('16:9');
                } else {
                  setAssetType('Character');
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="font-extrabold text-xs text-white">{p.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* CLOUDINARY STATUS BANNER */}
      {cloudinaryConfigured === false && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-3 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200"
        >
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-300">Cloudinary not configured — images served directly from Pollinations.AI</p>
            <p className="text-[11px] mt-0.5 text-amber-400">
              Set <code className="bg-amber-950 px-1 rounded">CLOUDINARY_CLOUD_NAME</code>, <code className="bg-amber-950 px-1 rounded">CLOUDINARY_API_KEY</code>, and <code className="bg-amber-950 px-1 rounded">CLOUDINARY_API_SECRET</code> in <code className="bg-amber-950 px-1 rounded">.env.local</code> to enable real Cloudinary transformations (bg removal, smart crop, f_auto/q_auto, AI Vision tags).
            </p>
          </div>
        </motion.div>
      )}
      {cloudinaryConfigured === true && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300"
        >
          <CloudUpload className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold">Cloudinary pipeline active</span>
          <span className="text-emerald-500">— generated images will be uploaded with f_auto, q_auto, bg removal, and AI Vision tags</span>
        </motion.div>
      )}

      {/* MODE TOGGLE (SINGLE VS ASSET PACK) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 inline-flex gap-2 backdrop-blur-xl">
          <button
            onClick={() => setGenerationMode('single')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              generationMode === 'single'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Single Asset</span>
          </button>

          <button
            onClick={() => setGenerationMode('pack')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              generationMode === 'pack'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/50 shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-purple-300" />
            <span>Generate Asset Pack (Hackathon Winner ✨)</span>
          </button>
        </div>
      </motion.div>

      {/* GENERATOR CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        
        {/* Error state */}
        <AnimatePresence>
          {generationError && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 flex items-start gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-sm text-red-300"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-200">Generation failed</p>
                <p className="text-xs mt-0.5 font-mono">{generationError}</p>
                <p className="text-xs mt-1 text-red-400">
                  Pollinations.AI is free and requires no key. If this persists, check your network or try a shorter prompt.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay loading state during generation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin flex items-center justify-center" />
                <Wand2 className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {generationMode === 'pack' ? 'Generating Asset Pack (3 images)...' : 'Generating AI Image...'}
                </h3>
                <motion.p
                  key={progressStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-cyan-400 font-mono mt-2 font-medium"
                >
                  {generationSteps[progressStep]}
                </motion.p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Real AI generation via Pollinations.AI — typically 15–40 s per image
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full"
                  animate={{ width: `${((progressStep + 1) / generationSteps.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono pt-4 border-t border-slate-800/80">
                <span>✓ Pollinations AI (flux model)</span>
                <span>✓ Cloudinary pipeline (if configured)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleGenerate} className="space-y-8">
          
          {/* Project Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Game Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-cyan-500 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.gameEngine}) — {p.assetCount} Assets
                </option>
              ))}
            </select>
          </div>

          {/* MULTI-MODEL GENERATION ENGINE SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Multi-Model Generation Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'auto', label: 'Auto Engine', desc: 'Unified Pipeline' },
                { id: 'cloudinary', label: 'Cloudinary AI', desc: 'f_auto, q_auto & bg_remove' },
                { id: 'pollinations', label: 'Pollinations AI', desc: 'Flux & SDXL Synthesis' },
                { id: 'higgsfield', label: 'Higgsfield Motion', desc: 'Camera & Video Animation' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGenerationModel(m.id as 'auto' | 'cloudinary' | 'pollinations' | 'higgsfield')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    generationModel === m.id
                      ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-extrabold text-white text-xs">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pack Name input (Only in Pack Mode) */}
          <AnimatePresence>
            {generationMode === 'pack' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 overflow-hidden"
              >
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Asset Pack Title
                </label>
                <input
                  type="text"
                  required
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  placeholder="e.g. Cyberpunk Warrior Asset Pack"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-purple-500/40 text-white font-bold outline-none focus:border-purple-400"
                />
                <p className="text-[11px] text-purple-300">
                  ⚡ Generates 3 synchronized deliverables: Full Character, 512×512 Portrait, and 256×256 Inventory Icon!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROMPT INPUT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                AI Visual Prompt
              </label>
              <button
                type="button"
                onClick={() => setPrompt(enhanceGamePrompt(prompt, assetType, style))}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600/30 to-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>✨ Auto-Enhance Prompt for Game Engine</span>
              </button>
            </div>
            
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe character armor, lighting, pose, style, level background..."
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-medium outline-none focus:border-cyan-500 transition-colors shadow-inner"
            />

            {/* Preset Chips */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">Try sample prompts:</span>
              <div className="flex flex-wrap gap-2">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-left"
                  >
                    &quot;{p}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* OPTIONS GRID (TYPE, STYLE, ASPECT RATIO, REALISM TIER) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            
            {/* Asset Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Asset Category
              </label>
              <select
                value={assetType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssetType(e.target.value as AssetType)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-cyan-500 text-xs"
              >
                <optgroup label="🧙 Characters & Entities">
                  <option value="Character">Character / Hero / NPC</option>
                  <option value="Creature">Creature / Monster / Boss</option>
                </optgroup>
                <optgroup label="⚔️ Armory & Equipment">
                  <option value="Weapon">Weapon / Sword / Gun</option>
                  <option value="Weapon Skin">Weapon Skin / Legendary Gun</option>
                  <option value="Item/Prop">Item / Prop / Equipment</option>
                </optgroup>
                <optgroup label="🌍 Environments & World">
                  <option value="Environment">Environment / Scene / Terrain</option>
                  <option value="Building">Building / Tower / Architecture</option>
                  <option value="Prop">Prop / Interactive Object</option>
                  <option value="Vehicle">Vehicle / Transport / Aircraft</option>
                </optgroup>
                <optgroup label="🎨 Textures & 2D Art">
                  <option value="Texture">Seamless PBR Texture / Material</option>
                  <option value="2D Sprite Sheet">2D Sprite Sheet / Tileset</option>
                  <option value="UI/Icon">UI Icon / Spell Card / HUD</option>
                </optgroup>
                <optgroup label="🎬 Media & Audio">
                  <option value="Marketing Art">Marketing Key Art / Poster</option>
                  <option value="Audio/SFX">Spatial SFX / Sound Effect</option>
                </optgroup>
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Art Style
              </label>
              <select
                value={style}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value as AssetStyle)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-cyan-500 text-xs"
              >
                <option value="3D Game Art">3D Game Art (Unreal 5)</option>
                <option value="Photorealistic">Photorealistic 8K Octane</option>
                <option value="Unreal Engine 5 PBR">UE5 Lumen Nanite PBR</option>
                <option value="Cyberpunk AAA">Cyberpunk AAA Hyper-Detail</option>
                <option value="Anime">Anime Cell Shaded</option>
                <option value="Pixel Art">Pixel Art (16-bit Retro)</option>
                <option value="Vector">Vector Clean (UI/Mobile)</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium outline-none focus:border-cyan-500 text-xs"
              >
                <option value="1:1">1:1 Square (1024 × 1024)</option>
                <option value="16:9">16:9 Landscape (1920 × 1080)</option>
                <option value="9:16">9:16 Portrait (1080 × 1920)</option>
                <option value="4:3">4:3 Standard (1024 × 768)</option>
              </select>
            </div>

            {/* Realism Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Realism Level
              </label>
              <select
                value={realismLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRealismLevel(e.target.value as 'ultra_8k' | 'realistic' | 'cinematic' | 'stylized')}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-bold outline-none focus:border-cyan-500 text-xs"
              >
                <option value="ultra_8k">Ultra 8K AAA Masterwork</option>
                <option value="photorealistic">Photorealistic Studio 8K</option>
                <option value="cinematic">Cinematic Movie Lighting</option>
                <option value="stylized">Vibrant Stylized PBR</option>
              </select>
            </div>

          </div>

          {/* 3D ASSET FACTORY SPECIFIC CONTROLS */}
          <AnimatePresence>
            {pillar === '3D ASSET' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-4 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                    <Box className="w-4 h-4 text-purple-400" />
                    <span>3D Game Asset Pipeline & Retopology Engine</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-mono">
                    Unity / Unreal Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Polygon Target Budget
                    </label>
                    <select
                      value={polyBudget}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPolyBudget(e.target.value as 'Low-Poly (5k)' | 'Mid-Poly (20k)' | 'AAA High-Poly (50k)')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    >
                      <option value="Low-Poly (5k)">Mobile Low-Poly (&lt; 5,000 Polys)</option>
                      <option value="Mid-Poly (20k)">Indie Mid-Poly (20,000 Polys)</option>
                      <option value="AAA High-Poly (50k)">AAA High-Detail (50,000 Polys)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Model Export Format
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportFormat(e.target.value as 'GLTF/GLB' | 'FBX' | 'OBJ' | 'USDZ')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    >
                      <option value="GLTF/GLB">GLTF 2.0 / GLB (Web & Three.js)</option>
                      <option value="FBX">Autodesk FBX (Unity & Unreal)</option>
                      <option value="OBJ">Wavefront OBJ (Blender / Maya)</option>
                      <option value="USDZ">Apple USDZ (AR & iOS)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-slate-300 font-medium">
                      <input
                        type="checkbox"
                        checked={autoRetopo}
                        onChange={(e) => setAutoRetopo(e.target.checked)}
                        className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                      />
                      <span className="text-[11px]">Auto Retopology & UV Unwrap</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-4 rounded-xl font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all ${
                generationMode === 'pack'
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-slate-950 shadow-purple-500/25'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-slate-950 shadow-cyan-500/25'
              }`}
            >
              <Wand2 className="w-5 h-5" />
              <span>
                {generationMode === 'pack' ? '✨ Generate Full Asset Pack' : '✨ Generate Single Asset'}
              </span>
            </motion.button>
          </div>

        </form>
      </motion.div>

    </main>
  );
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading AI Generator...
        </div>
      }>
        <GeneratorContent />
      </Suspense>
      <Footer />
    </div>
  );
}
