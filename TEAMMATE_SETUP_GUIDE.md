# 🚀 GameForge AI — Teammate Setup & Handoff Guide

Welcome to **GameForge AI** — The AI SaaS Platform for Indie Game Developers & Game Studios!

---

## 📦 What's Included in This Project
- **AI Asset & Pack Generator (`/generator`)**: Synthesizes 3D Game Art, Pixel Art, Anime, Vector, Photorealistic, UE5 PBR, and Cyberpunk AAA assets (Single asset & 1-Click Synchronized Asset Pack Engine).
- **Cloudinary Media Pipeline (`src/lib/cloudinary.ts`)**: Automated background removal (`e_background_removal`), smart gravity cropping (`c_crop,g_auto`), generative variations (`e_gen_replace`), and dynamic `f_auto,q_auto` delivery.
- **⚡ Exclusive Asset Power & Ability Matrix**: Interactive particle FX ability triggers, damage multipliers, power stats, and live execution logs.
- **🪂 3D Battle Royale Arena Simulator**: 100-Player Battle Royale sandbox with WASD movement, aiming, shooting, enemy bot AI spawning, and live kill feed.
- **🎮 Unreal Engine 5 & Unity 3D PBR Inspector**: Rotatable 3D PBR mesh viewport (Metallic, Roughness, Normal maps, Sun angle, Wireframe grid) with UE5 C++ and Unity URP C# exporters.
- **🔊 Spatial AI Audio & SFX Studio**: Web Audio API real-time synthesizer for gunshots, repulsor lasers, frag explosions, shields, and victory airhorns with `.WAV` export.
- **📦 3D Mesh Generator & Exporter**: Real-time 3D extrusion model preview and `.OBJ` / `.GLTF` mesh download exporter for Unity, Unreal Engine, and Blender.
- **🪂 PUBG / Free Fire BR HUD Simulator**: Live battle royale HUD with alive counter, minimap, kill feed, level 3 gear, and AWM sniper ammo slots.

---

## ⚡ Quick Start Instructions for Teammates

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy or create `.env.local` in the project root:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
HIGGSFIELD_API_KEY=your_higgsfield_key
```
*(Note: If Cloudinary env vars are omitted, Pollinations AI and fallback transformation URLs work out of the box!)*

### 3. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🗺️ Key Pages & Endpoints
- **Home / Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Studio Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **AI Generator Engine**: [http://localhost:3000/generator](http://localhost:3000/generator)
- **Cloudinary Asset Repository**: [http://localhost:3000/library](http://localhost:3000/library)
- **Iron Man 3D Asset Studio**: [http://localhost:3000/asset/asset-ironman-mark85](http://localhost:3000/asset/asset-ironman-mark85)
- **Goku 3D Asset Studio**: [http://localhost:3000/asset/asset-goku-kamehameha](http://localhost:3000/asset/asset-goku-kamehameha)
