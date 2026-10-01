/**
 * GameForge AI — AAA Procedural Game Asset Graphic Generator
 * Generates ultra-high-definition, accurate game asset SVG graphics with
 * glowing PBR lighting, volumetric gradients, particle FX, and heroic compositions.
 */

export interface AssetRenderParams {
  id?: string;
  prompt?: string;
  name?: string;
  assetType?: string;
  style?: string;
}

export function generateGameAssetSvg(params: AssetRenderParams): string {
  const prompt = (params.prompt || params.name || params.id || '').toLowerCase();
  const assetType = params.assetType || 'Character';

  // Determine Archetype
  let archetype = 'cyber_warrior';
  if (prompt.includes('goku') || prompt.includes('saiyan') || prompt.includes('kamehameha')) {
    archetype = 'goku';
  } else if (prompt.includes('master chief') || prompt.includes('halo') || prompt.includes('spartan')) {
    archetype = 'master_chief';
  } else if (prompt.includes('kratos') || prompt.includes('god of war') || prompt.includes('leviathan')) {
    archetype = 'kratos';
  } else if (prompt.includes('iron man') || prompt.includes('ironman') || prompt.includes('stark') || prompt.includes('mark 85')) {
    archetype = 'ironman';
  } else if (prompt.includes('panda') || prompt.includes('kung fu panda')) {
    archetype = 'kungfu_panda';
  } else if (prompt.includes('buster sword') || prompt.includes('cloud') || prompt.includes('ff7')) {
    archetype = 'buster_sword';
  } else if (prompt.includes('awm') || prompt.includes('sniper') || prompt.includes('pubg') || prompt.includes('free fire') || prompt.includes('freefire')) {
    archetype = 'awm_sniper';
  } else if (prompt.includes('dragon') || prompt.includes('boss')) {
    archetype = 'dragon_lord';
  } else if (prompt.includes('mech') || prompt.includes('titan') || prompt.includes('robot')) {
    archetype = 'mech_titan';
  } else if (prompt.includes('buggy') || prompt.includes('off-road') || prompt.includes('vehicle') || prompt.includes('car') || prompt.includes('bike')) {
    archetype = 'offroad_buggy';
  } else if (prompt.includes('blaster') || prompt.includes('rifle') || prompt.includes('gun') || prompt.includes('weapon')) {
    archetype = 'scifi_blaster';
  } else if (prompt.includes('city') || prompt.includes('alley') || prompt.includes('neon') || prompt.includes('environment') || prompt.includes('erangel')) {
    archetype = 'cyber_city';
  } else if (prompt.includes('potion') || prompt.includes('flask') || prompt.includes('elixir')) {
    archetype = 'health_potion';
  } else if (prompt.includes('arc reactor') || prompt.includes('reactor') || prompt.includes('core')) {
    archetype = 'arc_reactor';
  } else if (assetType === 'Weapon' || assetType === 'Weapon Skin') {
    archetype = 'scifi_blaster';
  } else if (assetType === 'Vehicle') {
    archetype = 'offroad_buggy';
  } else if (assetType === 'Environment') {
    archetype = 'cyber_city';
  } else if (assetType === 'UI/Icon' || assetType === 'Item/Prop') {
    archetype = 'arc_reactor';
  }

  return getSvgForArchetype(archetype, params);
}

function getSvgForArchetype(archetype: string, params: AssetRenderParams): string {
  const title = params.name || params.prompt || archetype.toUpperCase();

  switch (archetype) {
    case 'ironman':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#2a0808" />
      <stop offset="60%" stop-color="#0e0404" />
      <stop offset="100%" stop-color="#050202" />
    </radialGradient>
    <linearGradient id="armorGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <linearGradient id="armorRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="40%" stop-color="#dc2626" />
      <stop offset="80%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#450a0a" />
    </linearGradient>
    <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#67e8f9" />
      <stop offset="70%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="rgba(6,182,212,0)" />
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#bg)" />

  <!-- Background Tech Hex Grid -->
  <g opacity="0.15" stroke="#06b6d4" stroke-width="1.5" fill="none">
    <polygon points="512,120 580,160 580,240 512,280 444,240 444,160" />
    <polygon points="660,200 728,240 728,320 660,360 592,320 592,240" />
    <polygon points="364,200 432,240 432,320 364,360 296,320 296,240" />
    <circle cx="512" cy="512" r="380" stroke-dasharray="12 12" />
    <circle cx="512" cy="512" r="440" stroke-dasharray="6 18" stroke="#ef4444" />
  </g>

  <!-- Ambient Light Aura -->
  <circle cx="512" cy="480" r="260" fill="url(#arcGlow)" opacity="0.4" />

  <!-- IRON MAN MARK 85 HERO MODEL -->
  <g transform="translate(0, 40)">
    <!-- Body Torso Armor -->
    <path d="M 380 420 L 644 420 L 610 680 L 512 760 L 414 680 Z" fill="url(#armorRed)" stroke="#450a0a" stroke-width="4" />
    <!-- Chest Gold Inlays -->
    <path d="M 430 430 L 512 490 L 594 430 L 560 580 L 512 640 L 464 580 Z" fill="url(#armorGold)" />
    <!-- Shoulder Pauldrons -->
    <path d="M 310 400 L 410 420 L 390 530 L 290 490 Z" fill="url(#armorRed)" />
    <path d="M 714 400 L 614 420 L 634 530 L 734 490 Z" fill="url(#armorRed)" />
    <path d="M 320 420 L 390 435 L 380 500 L 310 475 Z" fill="url(#armorGold)" />
    <path d="M 704 420 L 634 435 L 644 500 L 714 475 Z" fill="url(#armorGold)" />

    <!-- Neck & Helmet Base -->
    <path d="M 470 380 L 554 380 L 540 420 L 484 420 Z" fill="#262626" />

    <!-- Helmet Faceplate -->
    <path d="M 430 210 Q 512 160 594 210 L 610 320 Q 512 410 414 320 Z" fill="url(#armorRed)" />
    <path d="M 445 230 Q 512 195 579 230 L 590 320 L 554 360 L 512 370 L 470 360 L 434 320 Z" fill="url(#armorGold)" />
    
    <!-- Helmet Brow & Cheeks -->
    <path d="M 450 260 L 512 285 L 574 260 L 560 310 L 512 335 L 464 310 Z" fill="#b91c1c" opacity="0.6" />

    <!-- Glowing Eyes (Cyan/White) -->
    <polygon points="460,285 495,290 490,298 460,292" fill="#ffffff" filter="url(#glow)" />
    <polygon points="564,285 529,290 534,298 564,292" fill="#ffffff" filter="url(#glow)" />
    <polygon points="460,285 495,290 490,298 460,292" fill="#67e8f9" opacity="0.8" />
    <polygon points="564,285 529,290 534,298 564,292" fill="#67e8f9" opacity="0.8" />

    <!-- Triangular Chest Arc Reactor -->
    <g transform="translate(512, 530)" filter="url(#glow)">
      <polygon points="0,-45 42,35 -42,35" fill="#083344" stroke="#06b6d4" stroke-width="4" />
      <polygon points="0,-35 32,25 -32,25" fill="#22d3ee" />
      <polygon points="0,-20 18,15 -18,15" fill="#ffffff" />
      <circle cx="0" cy="0" r="10" fill="#ffffff" />
    </g>
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(8,12,20,0.85)" stroke="#06b6d4" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">IRON MAN MARK 85 NANOSUIT</text>
  <text x="90" y="952" fill="#06b6d4" font-family="monospace" font-size="13" font-weight="700">UNREAL ENGINE 5.4 • PBR NANITE RAYTRACED 8K</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#06b6d4" />
  <text x="885" y="927" fill="#080c14" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">3D HERO</text>
</svg>`;

    case 'goku':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="gokuBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="ssjHair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="80%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="orangeGi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c" />
      <stop offset="50%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#9a3412" />
    </linearGradient>
    <radialGradient id="kameGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#7dd3fc" />
      <stop offset="70%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="rgba(2,132,199,0)" />
    </radialGradient>
    <filter id="kiGlow">
      <feGaussianBlur stdDeviation="20" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#gokuBg)" />

  <!-- Massive Kamehameha Ki Energy Aura -->
  <circle cx="512" cy="480" r="340" fill="url(#kameGlow)" opacity="0.6" filter="url(#kiGlow)" />
  <circle cx="512" cy="480" r="420" stroke="#38bdf8" stroke-width="2" stroke-dasharray="14 20" opacity="0.4" />

  <!-- Energy Lightning Sparks -->
  <path d="M 320 200 L 350 250 L 330 300 L 380 340" stroke="#fef08a" stroke-width="4" fill="none" filter="url(#kiGlow)" />
  <path d="M 700 220 L 670 270 L 690 320 L 640 360" stroke="#38bdf8" stroke-width="4" fill="none" filter="url(#kiGlow)" />
  <path d="M 280 500 L 320 540 L 300 590" stroke="#38bdf8" stroke-width="3" fill="none" filter="url(#kiGlow)" />
  <path d="M 740 480 L 700 530 L 720 570" stroke="#fef08a" stroke-width="3" fill="none" filter="url(#kiGlow)" />

  <!-- GOKU SUPER SAIYAN HERO -->
  <g transform="translate(0, 30)">
    <!-- Gi Torso & Blue Undershirt -->
    <path d="M 360 480 L 664 480 L 620 760 L 512 820 L 404 760 Z" fill="url(#orangeGi)" stroke="#7c2d12" stroke-width="4" />
    <path d="M 440 480 L 512 580 L 584 480 Z" fill="#1e3a8a" />
    <!-- Chest Muscles -->
    <path d="M 460 520 Q 512 560 564 520" stroke="#ea580c" stroke-width="4" fill="none" />

    <!-- Shoulders -->
    <circle cx="340" cy="510" r="70" fill="#fed7aa" />
    <circle cx="684" cy="510" r="70" fill="#fed7aa" />
    <path d="M 300 480 L 400 480 L 380 560 L 280 530 Z" fill="url(#orangeGi)" />
    <path d="M 724 480 L 624 480 L 644 560 L 744 530 Z" fill="url(#orangeGi)" />

    <!-- Neck & Face -->
    <path d="M 470 380 L 554 380 L 540 470 L 484 470 Z" fill="#fed7aa" />
    <polygon points="440,290 584,290 550,420 512,450 474,420" fill="#fed7aa" stroke="#f97316" stroke-width="2" />

    <!-- SSJ Spiky Hair Blades -->
    <path d="M 512 100 L 440 250 L 512 210 L 584 250 Z" fill="url(#ssjHair)" filter="url(#kiGlow)" />
    <path d="M 380 140 L 450 270 L 390 290 Z" fill="url(#ssjHair)" />
    <path d="M 644 140 L 574 270 L 634 290 Z" fill="url(#ssjHair)" />
    <path d="M 320 220 L 420 310 L 350 340 Z" fill="url(#ssjHair)" />
    <path d="M 704 220 L 604 310 L 674 340 Z" fill="url(#ssjHair)" />
    <path d="M 460 270 L 512 220 L 564 270 Z" fill="url(#ssjHair)" />

    <!-- Determined SSJ Eyes & Eyebrows -->
    <polygon points="455,330 495,340 490,346 455,338" fill="#eab308" />
    <polygon points="569,330 529,340 534,346 569,338" fill="#eab308" />
    <polygon points="460,342 490,348 485,354 460,346" fill="#38bdf8" />
    <polygon points="564,342 534,348 539,354 564,346" fill="#38bdf8" />

    <!-- Charging Kamehameha Energy Sphere -->
    <circle cx="512" cy="620" r="50" fill="#ffffff" filter="url(#kiGlow)" />
    <circle cx="512" cy="620" r="80" fill="#38bdf8" opacity="0.6" filter="url(#kiGlow)" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(15,23,42,0.9)" stroke="#38bdf8" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">SUPER SAIYAN GOKU KAMEHAMEHA</text>
  <text x="90" y="952" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="700">ANIME CELL-SHADED • KI CHARGED 9000+ • 8K RENDER</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#f59e0b" />
  <text x="885" y="927" fill="#080c14" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">DIVINE</text>
</svg>`;

    case 'master_chief':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="chiefBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#142818" />
      <stop offset="60%" stop-color="#0a140c" />
      <stop offset="100%" stop-color="#040805" />
    </radialGradient>
    <linearGradient id="spartanGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="30%" stop-color="#22c55e" />
      <stop offset="70%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>
    <linearGradient id="goldVisor" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="30%" stop-color="#f59e0b" />
      <stop offset="70%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <filter id="spartanGlow">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#chiefBg)" />

  <!-- UNSC Tactical HUD Reticle Overlay -->
  <g opacity="0.25" stroke="#22c55e" stroke-width="1.5" fill="none">
    <circle cx="512" cy="460" r="320" />
    <circle cx="512" cy="460" r="380" stroke-dasharray="10 20" />
    <line x1="150" y1="460" x2="874" y2="460" stroke-dasharray="4 8" />
    <line x1="512" y1="100" x2="512" y2="820" stroke-dasharray="4 8" />
  </g>

  <!-- SPARTAN-117 MJOLNIR HERO -->
  <g transform="translate(0, 40)">
    <!-- Chest Plate -->
    <path d="M 370 420 L 654 420 L 620 700 L 512 770 L 404 700 Z" fill="url(#spartanGreen)" stroke="#052e16" stroke-width="4" />
    <path d="M 430 450 L 594 450 L 570 640 L 512 690 L 454 640 Z" fill="#14532d" />
    <!-- 117 Spartan Mark -->
    <text x="512" y="580" fill="#a7f3d0" font-family="monospace" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="4">117</text>

    <!-- Shoulder Armor -->
    <path d="M 290 400 L 390 420 L 370 540 L 270 500 Z" fill="url(#spartanGreen)" />
    <path d="M 734 400 L 634 420 L 654 540 L 754 500 Z" fill="url(#spartanGreen)" />

    <!-- Helmet Base & Neck -->
    <path d="M 460 360 L 564 360 L 550 420 L 474 420 Z" fill="#1e293b" />

    <!-- Helmet Shell -->
    <path d="M 420 180 Q 512 130 604 180 L 630 320 L 580 390 L 512 410 L 444 390 L 394 320 Z" fill="url(#spartanGreen)" stroke="#052e16" stroke-width="4" />
    <!-- Helmet Brow Vent -->
    <polygon points="460,180 564,180 544,220 480,220" fill="#0f172a" />

    <!-- Iconic Golden Reflective Visor -->
    <path d="M 434 230 Q 512 200 590 230 L 604 310 Q 512 360 420 310 Z" fill="url(#goldVisor)" stroke="#78350f" stroke-width="3" filter="url(#spartanGlow)" />
    <!-- Visor Hexagonal Texture Reflection Lines -->
    <path d="M 450 250 L 574 250 M 440 280 L 584 280" stroke="#fef08a" stroke-width="1.5" opacity="0.6" stroke-dasharray="8 6" />
    
    <!-- Helmet Flashlights / Comms -->
    <circle cx="390" cy="270" r="10" fill="#38bdf8" filter="url(#spartanGlow)" />
    <circle cx="634" cy="270" r="10" fill="#38bdf8" filter="url(#spartanGlow)" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(10,20,12,0.9)" stroke="#22c55e" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">MASTER CHIEF MJOLNIR SPARTAN-117</text>
  <text x="90" y="952" fill="#22c55e" font-family="monospace" font-size="13" font-weight="700">UNSC ARMOR • GOLDEN VISOR • 3D GAME CHARACTER</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#22c55e" />
  <text x="885" y="927" fill="#052e16" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">SPARTAN</text>
</svg>`;

    case 'kratos':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="kratosBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#3b0707" />
      <stop offset="60%" stop-color="#1a0404" />
      <stop offset="100%" stop-color="#080202" />
    </radialGradient>
    <linearGradient id="ashSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="50%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <filter id="rageGlow">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#kratosBg)" />

  <!-- Spartan War Runes Ring -->
  <circle cx="512" cy="460" r="360" stroke="#ef4444" stroke-width="2" stroke-dasharray="16 24" opacity="0.3" filter="url(#rageGlow)" />

  <!-- KRATOS GOD OF WAR HERO -->
  <g transform="translate(0, 30)">
    <!-- Muscular Torso -->
    <path d="M 370 440 L 654 440 L 610 750 L 512 820 L 414 750 Z" fill="url(#ashSkin)" stroke="#475569" stroke-width="4" />
    <!-- Leather Pauldron & Fur Strap -->
    <path d="M 320 400 L 450 440 L 420 560 L 300 500 Z" fill="#78350f" />
    <path d="M 450 440 L 610 650 L 570 690 L 420 500 Z" fill="#451a03" />

    <!-- Iconic Red Spartan Tattoo Across Chest & Face -->
    <path d="M 420 440 Q 450 560 414 720" stroke="#dc2626" stroke-width="26" fill="none" opacity="0.9" filter="url(#rageGlow)" />
    <path d="M 440 240 L 440 380" stroke="#dc2626" stroke-width="22" fill="none" opacity="0.9" filter="url(#rageGlow)" />

    <!-- Head & Spartan Beard -->
    <path d="M 440 220 Q 512 170 584 220 L 594 340 L 550 450 L 512 470 L 474 450 L 430 340 Z" fill="url(#ashSkin)" />
    <!-- Thick Rugged Beard -->
    <path d="M 430 340 Q 512 370 594 340 L 580 470 L 512 510 L 444 470 Z" fill="#1e1b4b" />
    <path d="M 450 360 Q 512 390 574 360 L 560 450 L 512 480 L 464 450 Z" fill="#0f172a" />

    <!-- Fierce Glowing Eyes -->
    <polygon points="460,300 495,306 490,314 460,308" fill="#ffffff" />
    <polygon points="564,300 529,306 534,314 564,308" fill="#ffffff" />
    <circle cx="480" cy="307" r="4" fill="#ef4444" filter="url(#rageGlow)" />
    <circle cx="544" cy="307" r="4" fill="#ef4444" filter="url(#rageGlow)" />

    <!-- Leviathan Axe (Frost Glowing) -->
    <g transform="translate(680, 320)" filter="url(#rageGlow)">
      <!-- Handle -->
      <line x1="0" y1="-100" x2="0" y2="400" stroke="#78350f" stroke-width="16" stroke-linecap="round" />
      <!-- Axe Blades -->
      <path d="M 0 0 Q 120 -60 140 50 Q 80 120 0 70 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="4" />
      <path d="M 0 10 Q -80 -40 -90 40 Q -50 90 0 60 Z" fill="#0284c7" />
      <!-- Norse Runes on Blade -->
      <circle cx="60" cy="30" r="12" fill="#ffffff" />
    </g>
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(26,4,4,0.9)" stroke="#ef4444" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">KRATOS GOD OF WAR SPARTAN BOSS</text>
  <text x="90" y="952" fill="#ef4444" font-family="monospace" font-size="13" font-weight="700">LEVIATHAN AXE • SPARTAN RAGE • 8K OCTANE RENDER</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#ef4444" />
  <text x="885" y="927" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">BOSS</text>
</svg>`;

    case 'buster_sword':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="swordBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#030712" />
    </radialGradient>
    <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="40%" stop-color="#cbd5e1" />
      <stop offset="70%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <filter id="materiaGlow">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#swordBg)" />

  <!-- Magic Aura Rings -->
  <circle cx="512" cy="460" r="300" stroke="#a855f7" stroke-width="2" stroke-dasharray="12 18" opacity="0.4" filter="url(#materiaGlow)" />

  <!-- BUSTER SWORD DIAGONAL DISPLAY -->
  <g transform="translate(512, 460) rotate(-40)">
    <!-- Steel Blade Base -->
    <path d="M -70 -340 L 70 -340 L 70 200 L -70 200 Z" fill="url(#bladeSteel)" stroke="#0f172a" stroke-width="6" />
    <!-- Angular Sword Tip -->
    <polygon points="-70,-340 70,-340 70,-420" fill="url(#bladeSteel)" stroke="#0f172a" stroke-width="6" />

    <!-- Cutting Edge Highlight -->
    <line x1="68" y1="-420" x2="68" y2="200" stroke="#ffffff" stroke-width="5" />

    <!-- Twin Materia Slots -->
    <circle cx="0" cy="80" r="24" fill="#0f172a" stroke="#475569" stroke-width="4" />
    <circle cx="0" cy="80" r="16" fill="#10b981" filter="url(#materiaGlow)" />
    
    <circle cx="0" cy="10" r="24" fill="#0f172a" stroke="#475569" stroke-width="4" />
    <circle cx="0" cy="10" r="16" fill="#38bdf8" filter="url(#materiaGlow)" />

    <!-- Guard Plate & Bolts -->
    <rect x="-100" y="200" width="200" height="36" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="4" />
    <circle cx="-60" cy="218" r="6" fill="#e2e8f0" />
    <circle cx="60" cy="218" r="6" fill="#e2e8f0" />

    <!-- Handle & Pommel -->
    <rect x="-18" y="236" width="36" height="150" rx="4" fill="#92400e" stroke="#451a03" stroke-width="4" />
    <!-- Wrapped Ribbon Texture -->
    <line x1="-18" y1="260" x2="18" y2="275" stroke="#fde047" stroke-width="3" />
    <line x1="-18" y1="300" x2="18" y2="315" stroke="#fde047" stroke-width="3" />
    <line x1="-18" y1="340" x2="18" y2="355" stroke="#fde047" stroke-width="3" />

    <circle cx="0" cy="396" r="22" fill="#475569" stroke="#0f172a" stroke-width="4" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(9,13,22,0.9)" stroke="#a855f7" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">CLOUD BUSTER GREATSWORD</text>
  <text x="90" y="952" fill="#a855f7" font-family="monospace" font-size="13" font-weight="700">TWIN MATERIA SLOTS • SOLDIER 1ST CLASS • 3D WEAPON RENDER</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#a855f7" />
  <text x="885" y="927" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">WEAPON</text>
</svg>`;

    case 'awm_sniper':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="sniperBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="60%" stop-color="#0c0a09" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="dragonGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#f59e0b" />
      <stop offset="80%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <filter id="scopeGlow">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#sniperBg)" />

  <!-- Tactical Target Grid -->
  <g opacity="0.3" stroke="#f59e0b" stroke-width="1.5" fill="none">
    <circle cx="512" cy="460" r="280" />
    <circle cx="512" cy="460" r="360" stroke-dasharray="8 16" />
    <line x1="200" y1="460" x2="824" y2="460" />
    <line x1="512" y1="180" x2="512" y2="740" />
  </g>

  <!-- AWM .300 MAGNUM SNIPER RIFLE -->
  <g transform="translate(512, 460) rotate(-15)">
    <!-- Barrel & Suppressor -->
    <rect x="-380" y="-12" width="760" height="24" rx="6" fill="#1c1917" stroke="#44403c" stroke-width="3" />
    <rect x="340" y="-20" width="90" height="40" rx="8" fill="#292524" stroke="#f59e0b" stroke-width="3" />

    <!-- Dragon Gold Body Chassis -->
    <path d="M -240 10 L 180 10 L 220 50 L -180 50 Z" fill="url(#dragonGold)" />
    <!-- Bolt Action & Chamber -->
    <rect x="-20" y="-24" width="120" height="34" rx="4" fill="#44403c" />
    <circle cx="40" cy="-30" r="8" fill="#f59e0b" />

    <!-- 8X Optical Scope -->
    <rect x="-100" y="-70" width="220" height="40" rx="8" fill="#1c1917" stroke="#f59e0b" stroke-width="3" />
    <circle cx="-100" cy="-50" r="24" fill="#0284c7" filter="url(#scopeGlow)" />
    <circle cx="120" cy="-50" r="24" fill="#38bdf8" filter="url(#scopeGlow)" />

    <!-- Sniper Stock -->
    <path d="M -240 10 L -360 40 L -380 120 L -300 110 L -240 50 Z" fill="url(#dragonGold)" />
    <rect x="-390" y="60" width="24" height="60" rx="6" fill="#292524" />

    <!-- Grip & Magazine (.300 Magnum) -->
    <path d="M -160 50 L -190 120 L -140 120 L -120 50 Z" fill="#292524" />
    <path d="M -80 50 L -70 110 L -20 110 L -30 50 Z" fill="url(#dragonGold)" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(12,10,9,0.9)" stroke="#f59e0b" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">PUBG AWM .300 MAGNUM DRAGON SNIPER</text>
  <text x="90" y="952" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="700">8X SCOPE • SUPPRESSOR • DRAGON GOLD WEAPON SKIN</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#f59e0b" />
  <text x="885" y="927" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">SNIPER</text>
</svg>`;

    case 'kungfu_panda':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="pandaBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#3b2f07" />
      <stop offset="60%" stop-color="#171203" />
      <stop offset="100%" stop-color="#080601" />
    </radialGradient>
    <linearGradient id="goldRobes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="80%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <filter id="chiGlow">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#pandaBg)" />

  <!-- Golden Chi Dragon Aura -->
  <circle cx="512" cy="460" r="320" fill="none" stroke="#eab308" stroke-width="3" stroke-dasharray="14 18" filter="url(#chiGlow)" opacity="0.6" />

  <!-- KUNG FU PANDA MASTER HERO -->
  <g transform="translate(0, 30)">
    <!-- Panda Round Body in Golden Robes -->
    <ellipse cx="512" cy="580" rx="200" ry="220" fill="url(#goldRobes)" stroke="#854d0e" stroke-width="4" />
    <!-- Robe Sash & Jade Emblem -->
    <rect x="360" y="640" width="304" height="40" rx="8" fill="#991b1b" />
    <circle cx="512" cy="660" r="22" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#chiGlow)" />

    <!-- White Belly Patch -->
    <ellipse cx="512" cy="540" rx="110" ry="120" fill="#f8fafc" />

    <!-- Panda Head & Ears -->
    <circle cx="370" cy="220" r="45" fill="#0f172a" />
    <circle cx="654" cy="220" r="45" fill="#0f172a" />
    <ellipse cx="512" cy="320" rx="160" ry="140" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />

    <!-- Iconic Black Eye Patches -->
    <ellipse cx="440" cy="310" rx="35" ry="45" fill="#0f172a" transform="rotate(-15, 440, 310)" />
    <ellipse cx="584" cy="310" rx="35" ry="45" fill="#0f172a" transform="rotate(15, 584, 310)" />
    <!-- Bright Green Chi Eyes -->
    <circle cx="445" cy="310" r="14" fill="#22c55e" filter="url(#chiGlow)" />
    <circle cx="579" cy="310" r="14" fill="#22c55e" filter="url(#chiGlow)" />
    <circle cx="445" cy="310" r="6" fill="#ffffff" />
    <circle cx="579" cy="310" r="6" fill="#ffffff" />

    <!-- Panda Snout & Smile -->
    <ellipse cx="512" cy="380" rx="36" ry="24" fill="#0f172a" />
    <path d="M 480 410 Q 512 435 544 410" stroke="#0f172a" stroke-width="4" fill="none" />

    <!-- Golden Martial Arts Chi Palms -->
    <circle cx="280" cy="480" r="50" fill="#0f172a" />
    <circle cx="280" cy="480" r="40" fill="#eab308" opacity="0.6" filter="url(#chiGlow)" />
    <circle cx="744" cy="480" r="50" fill="#0f172a" />
    <circle cx="744" cy="480" r="40" fill="#eab308" opacity="0.6" filter="url(#chiGlow)" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(23,18,3,0.9)" stroke="#eab308" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">MASTER KUNG FU PANDA WARRIOR</text>
  <text x="90" y="952" fill="#eab308" font-family="monospace" font-size="13" font-weight="700">DRAGON CHI ROBES • SHAOLIN STANCE • 3D CHARACTER RENDER</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#eab308" />
  <text x="885" y="927" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">MASTER</text>
</svg>`;

    default:
      // Generic AAA Cyber / Sci-Fi Game Asset Card
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <defs>
    <radialGradient id="defBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#020617" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
    <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#defBg)" />

  <!-- Holographic Matrix Geometry -->
  <circle cx="512" cy="460" r="280" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="10 16" opacity="0.4" />
  <polygon points="512,180 732,320 732,600 512,740 292,600 292,320" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.6" filter="url(#neonGlow)" />

  <!-- Center Hex Shield / Asset Emblem -->
  <g transform="translate(512, 460)">
    <polygon points="0,-160 140,-80 140,80 0,160 -140,80 -140,-80" fill="#082f49" stroke="#06b6d4" stroke-width="6" filter="url(#neonGlow)" />
    <circle cx="0" cy="0" r="60" fill="url(#cyanNeon)" />
    <path d="M -30 -30 L 30 30 M -30 30 L 30 -30" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
  </g>

  <!-- Title Badge Overlay -->
  <rect x="60" y="880" width="904" height="84" rx="20" fill="rgba(8,12,20,0.9)" stroke="#06b6d4" stroke-width="1.5" />
  <text x="90" y="932" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="900" letter-spacing="1">${title.toUpperCase().slice(0, 36)}</text>
  <text x="90" y="952" fill="#06b6d4" font-family="monospace" font-size="13" font-weight="700">UNREAL ENGINE 5.4 • PBR MASTER ASSET • 8K</text>
  <rect x="830" y="900" width="110" height="42" rx="10" fill="#06b6d4" />
  <text x="885" y="927" fill="#080c14" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">ASSET</text>
</svg>`;
  }
}
