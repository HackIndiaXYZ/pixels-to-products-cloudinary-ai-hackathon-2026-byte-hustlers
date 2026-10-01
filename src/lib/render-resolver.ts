/**
 * High-definition photorealistic 3D game render resolver.
 * Ensures zero broken images, instant local loading, and genuine AAA game visuals.
 */

export function getPhotorealistic3DRender(query?: string, fallbackCategory?: string): string {
  const q = (query || '').toLowerCase();

  // Character matches
  if (q.includes('ironman') || q.includes('iron man') || q.includes('stark') || q.includes('nanotech') || q.includes('mark 85') || q.includes('nanosuit')) {
    if (q.includes('reactor') || q.includes('core')) return '/assets/renders/arcreactor.jpg';
    return '/assets/renders/ironman.jpg';
  }
  if (q.includes('goku') || q.includes('kamehameha') || q.includes('saiyan') || q.includes('dragon ball') || q.includes('dragonball')) {
    return '/assets/renders/goku.jpg';
  }
  if (q.includes('master chief') || q.includes('halo') || q.includes('spartan') || q.includes('mjolnir') || q.includes('117')) {
    return '/assets/renders/masterchief.jpg';
  }
  if (q.includes('kratos') || q.includes('god of war') || q.includes('leviathan') || q.includes('spartan rage')) {
    return '/assets/renders/kratos.jpg';
  }
  if (q.includes('panda') || q.includes('kung fu') || q.includes('kungfu') || q.includes('shaolin')) {
    return '/assets/renders/kungfupanda.jpg';
  }
  if (q.includes('geralt') || q.includes('witcher') || q.includes('rivia')) {
    return '/assets/renders/geralt.jpg';
  }

  // Weapons & Items
  if (q.includes('buster sword') || q.includes('cloud') || q.includes('greatsword') || q.includes('ff7') || q.includes('materia')) {
    return '/assets/renders/bustersword.jpg';
  }
  if (q.includes('awm') || q.includes('sniper') || q.includes('rifle') || q.includes('pubg') || q.includes('free fire') || q.includes('freefire')) {
    if (q.includes('buggy') || q.includes('vehicle') || q.includes('car')) return '/assets/renders/offroadbuggy.jpg';
    return '/assets/renders/awmsniper.jpg';
  }
  if (q.includes('raygun') || q.includes('ray gun') || q.includes('alien weapon')) {
    return '/assets/renders/raygun.jpg';
  }
  if (q.includes('blaster') || q.includes('plasma') || q.includes('laser') || q.includes('gun') || q.includes('weapon')) {
    return '/assets/renders/scifiblaster.jpg';
  }
  if (q.includes('potion') || q.includes('flask') || q.includes('health') || q.includes('elixir') || q.includes('mana')) {
    return '/assets/renders/healthpotion.jpg';
  }
  if (q.includes('reactor') || q.includes('arc') || q.includes('core') || q.includes('power core')) {
    return '/assets/renders/arcreactor.jpg';
  }
  if (q.includes('pokeball') || q.includes('pokemon')) {
    return '/assets/renders/pokeball.jpg';
  }
  if (q.includes('triforce') || q.includes('zelda') || q.includes('relic')) {
    return '/assets/renders/triforce.jpg';
  }

  // Boss & Mech
  if (q.includes('dragon') || q.includes('boss') || q.includes('inferno') || q.includes('obsidian') || q.includes('lava') || q.includes('monster')) {
    return '/assets/renders/dragonlord.jpg';
  }
  if (q.includes('mech') || q.includes('titan') || q.includes('robot') || q.includes('exoskeleton') || q.includes('gundam')) {
    return '/assets/renders/mechtitan.jpg';
  }

  // Vehicles
  if (q.includes('warthog') || q.includes('recon')) {
    return '/assets/renders/warthogrecon.jpg';
  }
  if (q.includes('bike') || q.includes('motorcycle') || q.includes('hoverbike') || q.includes('speed')) {
    return '/assets/renders/cyberbike.jpg';
  }
  if (q.includes('buggy') || q.includes('vehicle') || q.includes('car') || q.includes('truck') || q.includes('tank')) {
    return '/assets/renders/offroadbuggy.jpg';
  }

  // Environments
  if (q.includes('map') || q.includes('erangel') || q.includes('island') || q.includes('terrain')) {
    return '/assets/renders/erangelmap.jpg';
  }
  if (q.includes('city') || q.includes('metropolis') || q.includes('cyberpunk') || q.includes('neon') || q.includes('environment') || q.includes('sci-fi map')) {
    return '/assets/renders/cybercity.jpg';
  }

  // Characters generic
  if (q.includes('character') || q.includes('warrior') || q.includes('hero') || q.includes('ninja') || q.includes('soldier') || q.includes('avatar') || q.includes('operator')) {
    return '/assets/renders/cyberwarrior.jpg';
  }

  // Fallback by category
  const cat = (fallbackCategory || '').toLowerCase();
  if (cat.includes('weapon')) return '/assets/renders/awmsniper.jpg';
  if (cat.includes('vehicle')) return '/assets/renders/offroadbuggy.jpg';
  if (cat.includes('environment')) return '/assets/renders/cybercity.jpg';
  if (cat.includes('prop') || cat.includes('item')) return '/assets/renders/arcreactor.jpg';
  if (cat.includes('character')) return '/assets/renders/cyberwarrior.jpg';

  return '/assets/renders/ironman.jpg';
}
