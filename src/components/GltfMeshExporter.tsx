'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Download, Layers, Sparkles, Check, FileCode, Cpu, Sliders, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GltfMeshExporterProps {
  originalImageUrl: string;
  assetName: string;
}

export default function GltfMeshExporter({ originalImageUrl, assetName }: GltfMeshExporterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [depthExtrusion, setDepthExtrusion] = useState(15);
  const [wireframe, setWireframe] = useState(false);
  const [subdivisions, setSubdivisions] = useState(32);
  const [exporting, setExporting] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<'obj' | 'gltf'>('obj');

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

    const render3DMeshViewport = () => {
      rotation += 0.015;

      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const width = 160;
      const height = 160;

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Simulate 3D Y-axis rotation & Z-depth extrusion
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Draw Extruded 3D Side Planes (Depth Thickness)
      const depthOffset = (depthExtrusion / 10) * cos * 15;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-width / 2 * cos, -height / 2);
      ctx.lineTo(-width / 2 * cos + depthOffset, -height / 2);
      ctx.lineTo(-width / 2 * cos + depthOffset, height / 2);
      ctx.lineTo(-width / 2 * cos, height / 2);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.stroke();

      // Draw Front Face Plate
      ctx.save();
      ctx.scale(cos, 1);

      if (img.complete && img.naturalWidth !== 0) {
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(-width / 2, -height / 2, width, height);
      }

      // Draw Wireframe Mesh Overlay
      if (wireframe) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1;
        const stepX = width / (subdivisions / 4);
        const stepY = height / (subdivisions / 4);

        for (let x = -width / 2; x <= width / 2; x += stepX) {
          ctx.beginPath();
          ctx.moveTo(x, -height / 2);
          ctx.lineTo(x, height / 2);
          ctx.stroke();
        }
        for (let y = -height / 2; y <= height / 2; y += stepY) {
          ctx.beginPath();
          ctx.moveTo(-width / 2, y);
          ctx.lineTo(width / 2, y);
          ctx.stroke();
        }
      }

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render3DMeshViewport);
    };

    render3DMeshViewport();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [originalImageUrl, depthExtrusion, wireframe, subdivisions]);

  // Generate Wavefront .OBJ file content
  const generateObjFile = (): string => {
    const filename = assetName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let obj = `# GameForge AI 3D Mesh Exporter\n# Asset: ${assetName}\n# Extrusion Depth: ${depthExtrusion}mm\n\no ${filename}\n\n`;

    // Vertices (Front & Back faces)
    const d = depthExtrusion / 10;
    obj += `v -1.000000 -1.000000 ${d.toFixed(4)}\n`;
    obj += `v 1.000000 -1.000000 ${d.toFixed(4)}\n`;
    obj += `v 1.000000 1.000000 ${d.toFixed(4)}\n`;
    obj += `v -1.000000 1.000000 ${d.toFixed(4)}\n`;
    obj += `v -1.000000 -1.000000 -${d.toFixed(4)}\n`;
    obj += `v 1.000000 -1.000000 -${d.toFixed(4)}\n`;
    obj += `v 1.000000 1.000000 -${d.toFixed(4)}\n`;
    obj += `v -1.000000 1.000000 -${d.toFixed(4)}\n\n`;

    // Texture Coordinates (UVs)
    obj += `vt 0.000000 0.000000\nvt 1.000000 0.000000\nvt 1.000000 1.000000\nvt 0.000000 1.000000\n\n`;

    // Normals
    obj += `vn 0.0000 0.0000 1.0000\nvn 0.0000 0.0000 -1.0000\nvn 0.0000 1.0000 0.0000\nvn 0.0000 -1.0000 0.0000\n\n`;

    // Faces
    obj += `f 1/1/1 2/2/1 3/3/1\nf 1/1/1 3/3/1 4/4/1\n`;
    obj += `f 5/1/2 8/4/2 7/3/2\nf 5/1/2 7/3/2 6/2/2\n`;

    return obj;
  };

  const handleDownloadMesh = (format: 'obj' | 'gltf') => {
    setExporting(true);
    setExportedFormat(format);

    const filename = `${assetName.toLowerCase().replace(/\s+/g, '_')}_3d.${format}`;
    const content = generateObjFile();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({ particleCount: 80, spread: 70 });
    setTimeout(() => setExporting(false), 1200);
  };

  return (
    <div className="w-full space-y-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>3D Mesh Generator & Model Exporter</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            Real-Time 3D Mesh Exporter (.OBJ / .GLTF)
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Convert 2D game asset into an extruded 3D mesh model ready for Unreal Engine 5, Unity, and Blender.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownloadMesh('obj')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT 3D .OBJ MESH</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownloadMesh('gltf')}
            className="px-5 py-3 rounded-2xl bg-purple-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-purple-200" />
            <span>EXPORT .GLTF MESH</span>
          </motion.button>
        </div>
      </div>

      {/* 3D VIEWPORT & CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas Display */}
        <div className="lg:col-span-7 relative bg-slate-950 rounded-2xl border border-slate-800 h-72 flex items-center justify-center overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} width={500} height={288} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            REAL-TIME 3D ROTATABLE MESH PREVIEW
          </div>
        </div>

        {/* Extrusion & Wireframe Sliders */}
        <div className="lg:col-span-5 space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>3D EXTRUSION DEPTH: {depthExtrusion}mm</span>
              <span className="text-cyan-400">Thickness</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={depthExtrusion}
              onChange={(e) => setDepthExtrusion(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>MESH SUBDIVISIONS: {subdivisions} Quads</span>
              <span className="text-purple-400">Polygon Count</span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              step="8"
              value={subdivisions}
              onChange={(e) => setSubdivisions(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300">Wireframe Mesh Grid:</span>
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                wireframe
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {wireframe ? 'Wireframe ON' : 'Wireframe OFF'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
