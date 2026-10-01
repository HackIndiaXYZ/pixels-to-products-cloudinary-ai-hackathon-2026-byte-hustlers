import { AssetType, AssetStyle } from '@/types/gameforge';

export type RealismLevel = 'realistic' | 'cinematic' | 'stylized' | 'ultra_8k';

export function enhanceGamePrompt(
  basePrompt: string,
  assetType: AssetType,
  style: AssetStyle,
  realismLevel: RealismLevel = 'ultra_8k'
): string {
  if (!basePrompt.trim()) return basePrompt;

  const styleModifiers: Record<AssetStyle, string> = {
    'Photorealistic': 'photorealistic 8k octane render, hyperrealistic skin and cloth micro-textures, micro-surface imperfections, ray-traced subsurface scattering, realistic volumetric studio lighting, Hasselblad H6D-100c 100mm lens, filmic color grading, masterwork quality, award-winning CGI',
    '3D Game Art': 'rendered in Unreal Engine 5.4 Lumen nanite, 8k resolution, volumetric global illumination, PBR metallic and roughness maps, Octane Render style, dramatic rim lighting, sharp focus, professional artstation trending',
    'Unreal Engine 5 PBR': 'Unreal Engine 5.4 Lumen Nanite PBR shader, raytraced ambient occlusion, 8k PBR material maps, realistic physics-based lighting, cinematic focal depth, artstation headquarters portfolio quality',
    'Cyberpunk AAA': 'cyberpunk AAA hyper-detailed aesthetic, glowing intricate cyan and magenta neon accents, carbon fiber and brushed titanium plating, sharp reflections, high contrast dramatic cinematic key art, 8k resolution',
    'Anime': 'high-end cell-shaded anime game art, Studio Trigger and Arc System Works aesthetic, crisp vector-clean line art, dynamic high-impact pose, dramatic cinematic rim lighting, vibrant color palette, 8k game key art',
    'Pixel Art': 'authentic 16-bit retro arcade pixel art, precise pixel grid alignment, vibrant custom 32-color palette, dithered shading, nostalgic Capcom neo-geo arcade aesthetic',
    'Vector': 'clean vector illustration, sharp geometric silhouettes, smooth SVG color gradients, crisp iconographic clarity, modern game UI/HUD graphic'
  };

  const typeModifiers: Record<AssetType, string> = {
    'Character': 'isolated full-body character in balanced heroic stance, front-three-quarters view, centered composition, fully detailed armor and anatomy, crisp silhouette, clean background, game-ready character model',
    'Weapon': 'isolated weapon design, intricate mechanical and ergonomic details, metallic specular reflections, clean studio lighting on dark backdrop, game inventory asset',
    'Weapon Skin': 'isolated legendary battle royale firearm weapon skin, animated glowing holographic decals, anodized titanium barrel, high detail inspect screen',
    'Prop': 'isolated high-detail game prop item, realistic wear and tear, micro-scratches, clean directional studio lighting, game loot inventory render',
    'Item/Prop': 'isolated game inventory loot item, crisp edges, glowing rarity aura, high fidelity PBR materials, transparent or dark studio backdrop',
    'Environment': 'panoramic wide-angle cinematic environment, atmospheric depth fog, layered foreground and background architecture, epic scale, realistic horizon, matte painting 8k',
    'Vehicle': 'isolated high-speed armored vehicle, aerodynamic futuristic chassis, PBR carbon fiber and alloy body, realistic headlights, game-ready vehicle model',
    'Building': 'grand architectural structure, intricate futuristic facade details, modular sci-fi construction, volumetric lighting, epic scale',
    'Texture': 'seamless tileable PBR texture surface, macro view of high-detail material, diffuse normal roughness height maps, flat even lighting',
    'Creature': 'isolated mythical monster creature, dynamic predator stance, realistic scales or fur texturing, glowing eyes, cinematic boss battle key art',
    'UI/Icon': 'isolated game skill icon symbol, high contrast graphic, glowing magical or sci-fi glyph, centered circular framing, vector-sharp silhouette',
    '2D Sprite Sheet': '2D character sprite sheet animation atlas, sequential action keyframes, clean transparent background, pixel-perfect alignment',
    'Marketing Art': 'epic cinematic game cover key art poster, dramatic triangular composition, volumetric smoke and lens flare, 8k promotional hero render',
    'Audio/SFX': 'isolated spatial audio sound acoustic visualizer, pulsing frequency spectrum, neon waveform telemetry'
  };

  const realismBoosters: Record<RealismLevel, string> = {
    ultra_8k: '8k UHD, ultra-detailed, highly accurate proportions, photorealistic rendering, volumetric lighting, masterpiece, no blur, no distortion, sharp focus',
    realistic: 'photorealistic detail, natural lighting, sharp depth of field, high fidelity, 4k quality, crisp render',
    cinematic: 'cinematic lighting, anamorphic lens flare, dramatic shadows, movie still, color graded, photorealistic',
    stylized: 'vibrant color harmony, expressive silhouette, clean stylized rendering, iconic design, highly detailed'
  };

  // Clean prompt by removing redundant trailing punctuation
  const cleanPrompt = basePrompt.trim().replace(/[.,;]+$/, '');
  const lower = cleanPrompt.toLowerCase();

  // Character Archetype Specialization for extreme visual accuracy
  let archetypeEnhancement = '';
  if (lower.includes('kratos') || lower.includes('god of war')) {
    archetypeEnhancement = ', Spartan warrior with pale ash skin, crimson tattoo markings, rugged beard, fur-lined leather pauldrons, wielding frost-glowing Leviathan Axe, Norse mythology background';
  } else if (lower.includes('goku') || lower.includes('saiyan')) {
    archetypeEnhancement = ', Super Saiyan martial artist in iconic orange and blue gi with glowing spiky golden hair, radiating electric blue and gold ki energy aura';
  } else if (lower.includes('master chief') || lower.includes('halo')) {
    archetypeEnhancement = ', Spartan-117 in olive green battle-tested MJOLNIR powered assault armor with iridescent gold reflective faceplate visor, unsc military grade';
  } else if (lower.includes('iron man') || lower.includes('ironman') || lower.includes('tony stark')) {
    archetypeEnhancement = ', Mark 85 armor in polished candy-apple metallic crimson and gold nano-plating, illuminated triangular chest arc reactor and repulsor palms';
  } else if (lower.includes('cloud') || lower.includes('buster sword') || lower.includes('ff7')) {
    archetypeEnhancement = ', blonde spiky-haired SOLDIER 1st class mercenary in dark sleeveless vest and pauldron, wielding massive steel Buster Sword with twin materia slots';
  } else if (lower.includes('panda') || lower.includes('kung fu panda')) {
    archetypeEnhancement = ', anthropomorphic giant panda martial arts master wearing ornate embroidered golden silk shaolin robes and leather bracers, energetic kung fu stance';
  } else if (lower.includes('geralt') || lower.includes('witcher')) {
    archetypeEnhancement = ', White Wolf monster hunter with dual silver and steel swords sheathed on back, scarred face, yellow cat eyes, studded leather armor';
  } else if (lower.includes('awm') || lower.includes('sniper')) {
    archetypeEnhancement = ', precision bolt-action .300 magnum heavy sniper rifle, 8x optical scope, threaded barrel suppressor, tactical bipod, dragon gold engraved weapon skin';
  }

  // Detect if user requested multiple characters/team/group
  const isMultiCharacter =
    assetType === 'Character' &&
    (lower.includes(' and ') ||
     lower.includes(' with ') ||
     lower.includes('team') ||
     lower.includes('group') ||
     lower.includes('squad') ||
     lower.includes('trio') ||
     lower.includes('duo') ||
     lower.includes('heroes') ||
     lower.includes('ensemble'));

  let typeMod = typeModifiers[assetType] || typeModifiers['Character'];
  if (isMultiCharacter) {
    typeMod = 'epic dynamic group composition featuring all mentioned characters side-by-side in full view, distinct silhouettes and individual powers for each hero, cinematic team lineup, wide balanced studio lighting on all characters, game-ready character ensemble';
  }

  const styleMod = styleModifiers[style] || styleModifiers['3D Game Art'];
  const booster = realismBoosters[realismLevel] || realismBoosters.ultra_8k;

  return `${cleanPrompt}${archetypeEnhancement}, ${typeMod}, ${styleMod}, ${booster}`;
}
