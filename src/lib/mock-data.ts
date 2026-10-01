import { GameAsset, Project, ExclusivePower } from '@/types/gameforge';
import { getSmartCropVariants, getGenerativeVariations, getBackgroundRemovedUrl } from './cloudinary';

export function getAssetExclusivePower(asset: GameAsset): ExclusivePower {
  if (asset.exclusivePower) return asset.exclusivePower;

  const lower = (asset.name + ' ' + asset.prompt + ' ' + asset.tags.join(' ')).toLowerCase();

  if (lower.includes('goku') || lower.includes('kamehameha') || lower.includes('saiyan')) {
    return {
      powerName: 'Super Saiyan Kamehameha Wave 9000+',
      powerType: 'Divine',
      powerLevel: 99,
      description: 'Gathers cosmic energy into a devastating Kamehameha beam wave, disintegrating targets across the battle arena.',
      manaCost: 100,
      cooldownSeconds: 10,
      damageMultiplier: '+9000% Saiyan Energy Beam',
      elementAffinity: 'Dragon Chi',
      passiveBuff: '+50% Ki Energy Charge & Invincibility Stance',
      particleFXColor: '#38bdf8',
      soundEffectName: 'kamehameha_wave_blast.wav',
      unityCodeSnippet: `// Unity C# - Goku Kamehameha Power
public void UnleashKamehameha() {
    Instantiate(kamehamehaBeamFX, transform.position, transform.rotation);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Goku Kamehameha Power
void AGokuCharacter::UnleashKamehamehaWave() {
    SpawnBeamParticleSystem();
}`,
      godotCodeSnippet: `# Godot GDScript - Goku Kamehameha Power
func unleash_kamehameha():
    $BeamParticles.emitting = true`
    };
  }

  if (lower.includes('master chief') || lower.includes('halo') || lower.includes('mjolnir')) {
    return {
      powerName: 'MJOLNIR Shield Overcharge & Plasma Burst',
      powerType: 'Ultimate',
      powerLevel: 97,
      description: 'Overcharges energy shield for 100% damage absorption and fires a precision Spartan plasma burst.',
      manaCost: 75,
      cooldownSeconds: 8,
      damageMultiplier: '+500% Spartan Plasma Pulse',
      elementAffinity: 'Arc Energy',
      passiveBuff: 'Instant Overshield & Tactical HUD Tracking',
      particleFXColor: '#10b981',
      soundEffectName: 'spartan_shield_charge.wav',
      unityCodeSnippet: `// Unity C# - Master Chief MJOLNIR Power
public void ActivateMJOLNIRShield() {
    ShieldSystem.instance.Overshield(1000f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Master Chief Power
void AMasterChief::OverchargeShield() {
    ApplyOvershield(1000.0f);
}`,
      godotCodeSnippet: `# Godot GDScript - Master Chief Power
func overcharge_shield():
    shield_capacity = 200.0`
    };
  }

  if (lower.includes('kratos') || lower.includes('god of war') || lower.includes('leviathan')) {
    return {
      powerName: 'Leviathan Axe Frost Nova & Spartan Rage',
      powerType: 'Divine',
      powerLevel: 99,
      description: 'Hurls the Leviathan Axe to freeze targets in a Frost Nova shockwave, triggering unstoppable Spartan Rage.',
      manaCost: 85,
      cooldownSeconds: 12,
      damageMultiplier: '+750% Spartan Cleave Frost Shockwave',
      elementAffinity: 'Volcanic Plasma',
      passiveBuff: 'Unstoppable Spartan Stun Immunity & +50% Melee Lifesteal',
      particleFXColor: '#ef4444',
      soundEffectName: 'spartan_rage_roar.wav',
      unityCodeSnippet: `// Unity C# - Kratos Leviathan Power
public void HurlLeviathanAxe() {
    Instantiate(frostNovaFX, target.position, Quaternion.identity);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Kratos Power
void AKratosCharacter::ActivateSpartanRage() {
    bIsSpartanRageActive = true;
}`,
      godotCodeSnippet: `# Godot GDScript - Kratos Power
func activate_spartan_rage():
    melee_damage_multiplier = 7.5`
    };
  }

  if (lower.includes('awm') || lower.includes('sniper') || lower.includes('pubg') || lower.includes('free fire') || lower.includes('freefire')) {
    return {
      powerName: 'AWM .300 Magnum Headshot Vaporizer',
      powerType: 'Technological',
      powerLevel: 98,
      description: 'Fires a high-velocity .300 Magnum round through armor, dealing 1000% critical headshot damage.',
      manaCost: 30,
      cooldownSeconds: 5,
      damageMultiplier: '+1000% Armor Piercing Headshot',
      elementAffinity: 'Arc Energy',
      passiveBuff: '8x Scope Eagle Vision & Zero Recoil Stability',
      particleFXColor: '#f59e0b',
      soundEffectName: 'awm_headshot_blast.wav',
      unityCodeSnippet: `// Unity C# - AWM Sniper Headshot Power
public void FireAWMSniper() {
    RaycastHit hit;
    if (Physics.Raycast(cameraTransform.position, cameraTransform.forward, out hit, 1000f)) {
        hit.collider.GetComponent<Health>()?.TakeDamage(1000f);
    }
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - AWM Sniper Power
void AAWMSniper::FireMagnumRound() {
    FHitResult Hit;
    PerformLineTrace(Hit, 100000.0f);
}`,
      godotCodeSnippet: `# Godot GDScript - AWM Sniper Power
func fire_awm_sniper():
    $RayCast3D.force_raycast_update()`
    };
  }

  if (lower.includes('buster sword') || lower.includes('cloud') || lower.includes('ff7')) {
    return {
      powerName: 'Omnislash Limit Break',
      powerType: 'Ultimate',
      powerLevel: 98,
      description: 'Executes a 7-hit aerial slashing combo with Cloud’s Buster Sword, finishing with a massive shockwave.',
      manaCost: 90,
      cooldownSeconds: 14,
      damageMultiplier: '+800% 7-Hit Aerial Slash Combo',
      elementAffinity: 'Quantum Void',
      passiveBuff: '+30% Critical Hit Chance & Limit Gauge Fill Speed',
      particleFXColor: '#a855f7',
      soundEffectName: 'omnislash_limit_break.wav',
      unityCodeSnippet: `// Unity C# - Buster Sword Omnislash
public void OmnislashLimitBreak() {
    StartCoroutine(Execute7HitCombo());
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Buster Sword Power
void ACloudCharacter::OmnislashLimitBreak() {
    PlayComboMontage();
}`,
      godotCodeSnippet: `# Godot GDScript - Buster Sword Power
func omnislash_limit_break():
    $ComboAnimationPlayer.play("omnislash")`
    };
  }

  if (lower.includes('ironman') || lower.includes('iron man') || lower.includes('stark') || lower.includes('mark 85') || lower.includes('nanosuit')) {
    return {
      powerName: 'Unibeam Overload & Repulsor Matrix',
      powerType: 'Ultimate',
      powerLevel: 99,
      description: 'Channels 100% Stark Arc Reactor core power into a 500% concentrated repulsor unibeam blast, deploying a nanotech energy shield.',
      manaCost: 80,
      cooldownSeconds: 8,
      damageMultiplier: '+500% Arc Repulsor Beam Damage',
      elementAffinity: 'Arc Energy',
      passiveBuff: '+40% Shield Regeneration & Repulsor Flight Speed',
      particleFXColor: '#06b6d4',
      soundEffectName: 'repulsor_unibeam_blast.wav',
      unityCodeSnippet: `// Unity C# - Iron Man Exclusive Power
public class IronManUnibeamPower : MonoBehaviour {
    [SerializeField] private ParticleSystem unibeamFX;
    [SerializeField] private float damage = 500f;

    public void UnleashUnibeam() {
        unibeamFX?.Play();
        Collider[] hits = Physics.OverlapSphere(transform.position, 15f);
        foreach (var hit in hits) {
            if (hit.CompareTag("Enemy")) hit.GetComponent<EnemyHealth>()?.TakeDamage(damage);
        }
    }
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Iron Man Exclusive Power
void AIronManCharacter::UnleashUnibeamOverload() {
    UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), UnibeamParticleSystem, GetActorLocation());
    ApplyRadialDamage(GetWorld(), 500.0f, GetActorLocation(), 1500.0f, UDamageType::StaticClass(), TArray<AActor*>(), this);
}`,
      godotCodeSnippet: `# Godot GDScript - Iron Man Exclusive Power
func unleash_unibeam_overload():
    $UnibeamParticles.emitting = true
    for enemy in $Area3D.get_overlapping_bodies():
        if enemy.is_in_group("enemies"):
            enemy.take_damage(500)`
    };
  }

  if (lower.includes('arc reactor') || lower.includes('power core')) {
    return {
      powerName: 'Zero-Point Energy Core Synthesis',
      powerType: 'Technological',
      powerLevel: 95,
      description: 'Generates infinite zero-point energy, eliminating all skill mana costs and boosting squad power by 300%.',
      manaCost: 0,
      cooldownSeconds: 12,
      damageMultiplier: '+300% Energy Output Amplification',
      elementAffinity: 'Arc Energy',
      passiveBuff: 'Infinite Mana Reserve & 0.5s Skill Cooldown Reduction',
      particleFXColor: '#38bdf8',
      soundEffectName: 'arc_core_overcharge.wav',
      unityCodeSnippet: `// Unity C# - Arc Reactor Power
public void ActivateArcCore() {
    PlayerStats.instance.InfiniteMana(15f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Arc Reactor Power
void AArcReactorItem::ActivateEnergySynthesis() {
    PlayerCharacter->SetInfiniteMana(true);
}`,
      godotCodeSnippet: `# Godot GDScript - Arc Reactor Power
func activate_arc_core():
    player_stats.mana_cost_multiplier = 0.0`
    };
  }

  if (lower.includes('panda') || lower.includes('kung fu') || lower.includes('kungfu')) {
    return {
      powerName: 'Golden Dragon Chi Palm Stun',
      powerType: 'Divine',
      powerLevel: 94,
      description: 'Summons ancestral golden dragon chi, slamming the ground to stun enemies in a 360-degree shockwave.',
      manaCost: 55,
      cooldownSeconds: 10,
      damageMultiplier: '+350% Holy Dragon Chi Stun',
      elementAffinity: 'Dragon Chi',
      passiveBuff: '+25% Martial Arts Stance Defense & Stun Duration',
      particleFXColor: '#f59e0b',
      soundEffectName: 'dragon_chi_impact.wav',
      unityCodeSnippet: `// Unity C# - Kung Fu Dragon Chi
public void DragonChiPalm() {
    Instantiate(dragonChiFX, transform.position, Quaternion.identity);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Kung Fu Dragon Chi
void APandaWarrior::DragonChiPalm() {
    UGameplayStatics::PlaySoundAtLocation(this, DragonSound, GetActorLocation());
}`,
      godotCodeSnippet: `# Godot GDScript - Kung Fu Dragon Chi
func dragon_chi_palm():
    $ChiParticles.restart()`
    };
  }

  if (lower.includes('dragon') || lower.includes('boss')) {
    return {
      powerName: 'Volcanic Inferno Awakening',
      powerType: 'Ultimate',
      powerLevel: 98,
      description: 'Erupts obsidian lava around the target area, burning target units with volcanic flame aura.',
      manaCost: 90,
      cooldownSeconds: 15,
      damageMultiplier: '+600% Firestorm Burning Damage',
      elementAffinity: 'Inferno Fire',
      passiveBuff: 'Immunity to Fire Damage & Burning Trail',
      particleFXColor: '#ef4444',
      soundEffectName: 'dragon_inferno_roar.wav',
      unityCodeSnippet: `// Unity C# - Dragon Volcanic Inferno
public void VolcanicInferno() {
    FireAreaDamage(600f, 20f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Dragon Volcanic Inferno
void ADragonBoss::VolcanicInferno() {
    SpawnFireZone();
}`,
      godotCodeSnippet: `# Godot GDScript - Dragon Volcanic Inferno
func volcanic_inferno():
    $LavaParticles.emitting = true`
    };
  }

  if (lower.includes('thor') || lower.includes('thunder') || lower.includes('lightning') || lower.includes('mjolnir')) {
    return {
      powerName: 'God of Thunder Mjolnir Lightning Tempest',
      powerType: 'Divine',
      powerLevel: 99,
      description: 'Summons a torrential thunderstorm from Asgard, striking all surrounding hostiles with 1,000,000-volt lightning bolts.',
      manaCost: 85,
      cooldownSeconds: 9,
      damageMultiplier: '+850% Asgardian Thunder Shockwave',
      elementAffinity: 'Arc Energy',
      passiveBuff: '+40% Lightning Resistance & Flight Momentum',
      particleFXColor: '#38bdf8',
      soundEffectName: 'thor_lightning_blast.wav',
      unityCodeSnippet: `// Unity C# - Thor God of Thunder Power
public void SummonLightningTempest() {
    Instantiate(lightningTempestFX, transform.position, Quaternion.identity);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Thor Power
void AThorCharacter::SummonLightningTempest() {
    SpawnLightningParticleSystem();
}`,
      godotCodeSnippet: `# Godot GDScript - Thor Power
func summon_lightning_tempest():
    $LightningParticles.emitting = true`
    };
  }

  if (lower.includes('thanos') || lower.includes('infinity') || lower.includes('gauntlet')) {
    return {
      powerName: 'Infinity Gauntlet Reality Warp & Cosmic Beam',
      powerType: 'Ultimate',
      powerLevel: 100,
      description: 'Channels the six Infinity Stones to warp local reality and vaporize high-threat targets instantly.',
      manaCost: 100,
      cooldownSeconds: 15,
      damageMultiplier: '+1000% Cosmic Reality Disintegration',
      elementAffinity: 'Quantum Void',
      passiveBuff: 'Complete Crowd-Control Immunity & Cosmic Aura',
      particleFXColor: '#a855f7',
      soundEffectName: 'infinity_snap_warp.wav',
      unityCodeSnippet: `// Unity C# - Thanos Infinity Power
public void UnleashInfinityWarp() {
    RealityWarpSystem.DisintegrateTargets(transform.position, 25f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Thanos Power
void AThanosCharacter::UnleashInfinityWarp() {
    ApplyUniversalRealityDisintegration(2500.0f);
}`,
      godotCodeSnippet: `# Godot GDScript - Thanos Power
func unleash_infinity_warp():
    $RealityWarpParticles.restart()`
    };
  }

  if (lower.includes('spider') || lower.includes('web') || lower.includes('venom')) {
    return {
      powerName: 'Symbiote Web-Strike & Bio-Electric Blast',
      powerType: 'Ultimate',
      powerLevel: 96,
      description: 'Fires high-tensile electric web tethers to pull and stun enemies before slamming them with bio-electric venom shock.',
      manaCost: 60,
      cooldownSeconds: 7,
      damageMultiplier: '+450% Bio-Electric Web Strike',
      elementAffinity: 'Arc Energy',
      passiveBuff: '+35% Wall-Climb Agility & Danger-Sense Dodge',
      particleFXColor: '#ec4899',
      soundEffectName: 'venom_bio_electric_strike.wav',
      unityCodeSnippet: `// Unity C# - Spider-Man / Venom Power
public void UnleashWebStrike() {
    WebTetherSystem.PullAndStunEnemies(transform.position, 15f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Spider-Man Power
void ASpiderHero::UnleashWebStrike() {
    LaunchWebTethers(GetActorLocation(), 1500.0f);
}`,
      godotCodeSnippet: `# Godot GDScript - Spider-Man Power
func unleash_web_strike():
    $WebParticles.emitting = true`
    };
  }

  if (lower.includes('ninja') || lower.includes('assassin') || lower.includes('stealth') || lower.includes('shadow') || lower.includes('katana') || lower.includes('samurai')) {
    return {
      powerName: 'Shadowstep Phantom Katana Decapitation',
      powerType: 'Ultimate',
      powerLevel: 97,
      description: 'Blinks behind the target through shadow realm dimensions, unleashing a 5-slash lethal phantom execution.',
      manaCost: 50,
      cooldownSeconds: 6,
      damageMultiplier: '+650% Shadowstep Critical Cleave',
      elementAffinity: 'Quantum Void',
      passiveBuff: 'Complete Invisibility for 3s upon stealth kill',
      particleFXColor: '#06b6d4',
      soundEffectName: 'shadowstep_katana_slash.wav',
      unityCodeSnippet: `// Unity C# - Shadow Assassin Katana Power
public void ShadowstepExecution() {
    StartCoroutine(ExecutePhantomBlinkCombo());
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Shadow Assassin Power
void AShadowAssassin::ExecutePhantomSlash() {
    TeleportBehindTargetAndExecute();
}`,
      godotCodeSnippet: `# Godot GDScript - Shadow Assassin Power
func shadowstep_execution():
    $PhantomSlashParticles.emitting = true`
    };
  }

  if (lower.includes('mage') || lower.includes('wizard') || lower.includes('sorcerer') || lower.includes('spell') || lower.includes('magic')) {
    return {
      powerName: 'Arcane Singularity Supernova',
      powerType: 'Divine',
      powerLevel: 98,
      description: 'Creates a localized gravitational singularity that draws all enemies inward before collapsing in a blinding arcane supernova explosion.',
      manaCost: 80,
      cooldownSeconds: 11,
      damageMultiplier: '+700% Arcane Gravitational Collapse',
      elementAffinity: 'Quantum Void',
      passiveBuff: '+25% Spell Critical Damage & Mana Regen Aura',
      particleFXColor: '#8b5cf6',
      soundEffectName: 'arcane_singularity_collapse.wav',
      unityCodeSnippet: `// Unity C# - Arcane Singularity Spell
public void CastArcaneSingularity() {
    Instantiate(singularityVortexFX, targetPos, Quaternion.identity);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Arcane Singularity Power
void AArcaneMage::CastSingularitySupernova() {
    SpawnSingularityVortexAtLocation(TargetLocation);
}`,
      godotCodeSnippet: `# Godot GDScript - Arcane Singularity Power
func cast_arcane_singularity():
    $SingularityParticles.emitting = true`
    };
  }

  if (lower.includes('vehicle') || lower.includes('buggy') || lower.includes('car') || lower.includes('tank') || lower.includes('bike')) {
    return {
      powerName: 'Nitro Overdrive & Heavy Ramming Kinetic Armor',
      powerType: 'Technological',
      powerLevel: 96,
      description: 'Injects high-octane nitro boost for +200% top speed, deploying reinforced kinetic ramming plows that launch enemy vehicles.',
      manaCost: 40,
      cooldownSeconds: 8,
      damageMultiplier: '+500% Kinetic Vehicle Impact',
      elementAffinity: 'Inferno Fire',
      passiveBuff: '+50% Vehicle Armor & Bulletproof Glass',
      particleFXColor: '#f97316',
      soundEffectName: 'nitro_overdrive_engine_roar.wav',
      unityCodeSnippet: `// Unity C# - Vehicle Nitro Ramming Power
public void ActivateNitroOverdrive() {
    VehiclePhysics.instance.BoostSpeed(2.0f, 6.0f);
}`,
      unrealCodeSnippet: `// Unreal Engine C++ - Vehicle Nitro Power
void AGameVehicle::ActivateNitroBoost() {
    VehicleMovementComponent->SetThrottleInput(2.5f);
}`,
      godotCodeSnippet: `# Godot GDScript - Vehicle Nitro Power
func activate_nitro():
    engine_force = 1200.0`
    };
  }

  return {
    powerName: `${asset.name} Unique Burst`,
    powerType: 'Elemental',
    powerLevel: 88,
    description: `Activates the exclusive ${asset.style} ability inherent to ${asset.name}, triggering game engine particle FX and high damage stats.`,
    manaCost: 40,
    cooldownSeconds: 6,
    damageMultiplier: '+250% Synergistic Power Damage',
    elementAffinity: asset.assetType === 'Character' ? 'Quantum Void' : asset.assetType === 'Item/Prop' ? 'Arc Energy' : 'Vitality Aura',
    passiveBuff: '+15% Studio Asset Performance Synergy',
    particleFXColor: '#a855f7',
    soundEffectName: 'asset_power_trigger.wav',
    unityCodeSnippet: `// Unity C# - ${asset.name} Power
public class ${asset.name.replace(/[^a-zA-Z0-9]/g, '')}Power : MonoBehaviour {
    public void ActivatePower() {
        Debug.Log("Unleashed ${asset.name} Exclusive Power!");
    }
}`,
    unrealCodeSnippet: `// Unreal Engine C++ - ${asset.name} Power
void AGameAssetPower::ActivateExclusivePower() {
    UE_LOG(LogTemp, Warning, TEXT("Activated ${asset.name} Power!"));
}`,
    godotCodeSnippet: `# Godot GDScript - ${asset.name} Power
func activate_exclusive_power():
    print("Activated ${asset.name} Power!")`
  };
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-cyberpunk-rpg',
    name: 'Cyberpunk RPG 2099',
    description: 'Futuristic sci-fi open world RPG with neon environments and cybernetic heroes.',
    gameEngine: 'Unity',
    assetCount: 1248,
    characterCount: 324,
    environmentCount: 187,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'proj-dungeon-crawler',
    name: 'Dungeon Realm 3D',
    description: 'Dark fantasy roguelike with mythic bosses, enchanted items, and ancient ruins.',
    gameEngine: 'Unreal Engine',
    assetCount: 680,
    characterCount: 142,
    environmentCount: 210,
    createdAt: '2026-08-25T14:30:00Z'
  },
  {
    id: 'proj-pixel-platformer',
    name: 'Pixel Knight Adventures',
    description: 'Retro 16-bit action platformer featuring pixel art heroes and boss sprites.',
    gameEngine: 'Godot',
    assetCount: 412,
    characterCount: 95,
    environmentCount: 110,
    createdAt: '2026-09-01T09:15:00Z'
  }
];

// High-definition photorealistic 3D AAA game asset renders (local zero-latency delivery)
const SAMPLE_ASSET_IMAGES = {
  ironman: '/assets/renders/ironman.jpg',
  arcReactor: '/assets/renders/arcreactor.jpg',
  cyberWarrior: '/assets/renders/cyberwarrior.jpg',
  dragonLord: '/assets/renders/dragonlord.jpg',
  sciFiBlaster: '/assets/renders/scifiblaster.jpg',
  cyberCity: '/assets/renders/cybercity.jpg',
  healthPotion: '/assets/renders/healthpotion.jpg',
  kungfuPanda: '/assets/renders/kungfupanda.jpg',
  mechTitan: '/assets/renders/mechtitan.jpg',
  cyberBike: '/assets/renders/cyberbike.jpg',
  goku: '/assets/renders/goku.jpg',
  masterChief: '/assets/renders/masterchief.jpg',
  kratos: '/assets/renders/kratos.jpg',
  geralt: '/assets/renders/geralt.jpg',
  awmSniper: '/assets/renders/awmsniper.jpg',
  busterSword: '/assets/renders/bustersword.jpg',
  rayGun: '/assets/renders/raygun.jpg',
  pokeball: '/assets/renders/pokeball.jpg',
  triforce: '/assets/renders/triforce.jpg',
  offroadBuggy: '/assets/renders/offroadbuggy.jpg',
  warthogRecon: '/assets/renders/warthogrecon.jpg',
  erangelMap: '/assets/renders/erangelmap.jpg'
};

export const INITIAL_ASSETS: GameAsset[] = [
  {
    id: 'asset-goku-kamehameha',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/goku_super_saiyan',
    name: 'Super Saiyan Goku Kamehameha Hero',
    assetType: 'Character',
    style: 'Anime',
    prompt: 'Goku Super Saiyan cell-shaded anime hero facing forward charging glowing blue kamehameha energy wave, 3d game render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.goku,
    originalUrl: SAMPLE_ASSET_IMAGES.goku,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.goku),
    tags: ['goku', 'dragon-ball', 'kamehameha', 'super-saiyan', 'anime', 'character', 'hero', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-17T08:00:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.goku),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.goku, 'Super Saiyan Goku Kamehameha Hero')
  },
  {
    id: 'asset-master-chief-spartan',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/master_chief_spartan',
    name: 'Master Chief MJOLNIR Spartan Hero',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Master Chief MJOLNIR powered assault armor with gold reflective visor, halo super-soldier stance, 3d game render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.masterChief,
    originalUrl: SAMPLE_ASSET_IMAGES.masterChief,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.masterChief),
    tags: ['master-chief', 'halo', 'spartan', 'mjolnir', 'sci-fi', 'character', 'armor', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-17T07:30:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.masterChief),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.masterChief, 'Master Chief MJOLNIR Spartan Hero')
  },
  {
    id: 'asset-kratos-god-of-war',
    projectId: 'proj-dungeon-crawler',
    projectName: 'Dungeon Realm 3D',
    cloudinaryPublicId: 'gameforge/kratos_spartan_warrior',
    name: 'Kratos God of War Spartan Boss',
    assetType: 'Character',
    style: 'Photorealistic',
    prompt: 'Kratos God of War with Leviathan Axe and glowing red tattoo markings, mythic spartan warrior 8k render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.kratos,
    originalUrl: SAMPLE_ASSET_IMAGES.kratos,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.kratos),
    tags: ['kratos', 'god-of-war', 'leviathan-axe', 'spartan', 'warrior', 'boss', 'character', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-17T07:00:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.kratos),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.kratos, 'Kratos God of War Spartan Boss')
  },
  {
    id: 'asset-awm-dragon-sniper',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/awm_dragon_sniper',
    name: 'AWM .300 Magnum Dragon Sniper Rifle',
    assetType: 'Weapon Skin',
    style: '3D Game Art',
    prompt: 'PUBG AWM .300 Magnum bolt-action sniper rifle with 8x scope, suppressor, dragon gold camo weapon skin',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.awmSniper,
    originalUrl: SAMPLE_ASSET_IMAGES.awmSniper,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.awmSniper),
    tags: ['awm', 'pubg', 'free-fire', 'sniper', 'weapon-skin', 'battle-royale', 'item', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-17T06:30:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.awmSniper),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.awmSniper, 'AWM .300 Magnum Dragon Sniper Rifle')
  },
  {
    id: 'asset-cloud-buster-sword',
    projectId: 'proj-dungeon-crawler',
    projectName: 'Dungeon Realm 3D',
    cloudinaryPublicId: 'gameforge/cloud_buster_sword',
    name: 'Cloud Buster Greatsword Legendary Weapon',
    assetType: 'Weapon Skin',
    style: '3D Game Art',
    prompt: 'Final Fantasy VII Cloud Strife massive steel Buster Sword with twin materia slots, anime greatsword 3d render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.busterSword,
    originalUrl: SAMPLE_ASSET_IMAGES.busterSword,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.busterSword),
    tags: ['buster-sword', 'ff7', 'cloud', 'sword', 'greatsword', 'weapon-skin', 'item', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-17T06:00:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.busterSword),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.busterSword, 'Cloud Buster Greatsword Legendary Weapon')
  },
  {
    id: 'asset-pubg-offroad-buggy',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/pubg_offroad_buggy',
    name: 'PUBG Armored Off-Road Tactical Buggy',
    assetType: 'Vehicle',
    style: 'Photorealistic',
    prompt: 'PUBG tactical off-road buggy vehicle with reinforced steel cage, desert terrain tires, game vehicle render',
    aspectRatio: '16:9',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.offroadBuggy,
    originalUrl: SAMPLE_ASSET_IMAGES.offroadBuggy,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.offroadBuggy),
    tags: ['pubg', 'buggy', 'vehicle', 'off-road', 'battle-royale', 'transport', 'cloudinary-ai'],
    width: 1920,
    height: 1080,
    format: 'jpg',
    createdAt: '2026-09-17T05:30:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.offroadBuggy),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.offroadBuggy, 'PUBG Armored Off-Road Tactical Buggy')
  },
  {
    id: 'asset-ironman-mark85',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/ironman_mark85_hero',
    name: 'Iron Man Mark 85 Nanosuit Hero',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Ironman Mark 85 hero character in metallic crimson and gold armor with arc reactor glowing chest, 3d game character render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.ironman,
    originalUrl: SAMPLE_ASSET_IMAGES.ironman,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.ironman),
    tags: ['ironman', 'marvel', 'hero', 'avenger', 'armor', 'character', 'nanosuit', '3d-model', 'stark', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-16T12:00:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.ironman),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.ironman, 'Iron Man Mark 85 hero character in metallic crimson and gold armor')
  },
  {
    id: 'asset-arc-reactor-core',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/stark_arc_reactor',
    name: 'Triangular Arc Reactor Power Core',
    assetType: 'Item/Prop',
    style: '3D Game Art',
    prompt: 'Glowing cyan triangular Stark arc reactor power core, high-tech chest component prop, inventory item',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.arcReactor,
    originalUrl: SAMPLE_ASSET_IMAGES.arcReactor,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.arcReactor),
    tags: ['arc-reactor', 'ironman', 'stark', 'energy', 'item', 'prop', 'sci-fi', 'inventory', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-16T11:30:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.arcReactor),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.arcReactor, 'Glowing cyan triangular Stark arc reactor power core')
  },
  {
    id: 'asset-mech-titan',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/titan_mech_suit',
    name: 'Stark-Tech Titan Mech Suit',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Heavy armaments mecha titan suit with repulsor cannons and titanium alloy plating, 3d game boss render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.mechTitan,
    originalUrl: SAMPLE_ASSET_IMAGES.mechTitan,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.mechTitan),
    tags: ['mech', 'robot', 'titan', 'boss', 'character', 'sci-fi', 'ironman-tech', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-16T10:15:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.mechTitan),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.mechTitan, 'Heavy armaments mecha titan suit with repulsor cannons')
  },
  {
    id: 'asset-kungfu-panda',
    projectId: 'proj-dungeon-crawler',
    projectName: 'Dungeon Realm 3D',
    cloudinaryPublicId: 'gameforge/kungfu_panda_hero',
    name: 'Master Kung Fu Panda Warrior',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Kung fu panda warrior hero in golden martial arts robes, battle stance, 3d game character render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.kungfuPanda,
    originalUrl: SAMPLE_ASSET_IMAGES.kungfuPanda,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.kungfuPanda),
    tags: ['panda', 'kung-fu', 'warrior', 'character', 'martial-arts', 'hero', '3d-model', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-15T10:00:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.kungfuPanda),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.kungfuPanda, 'Kung fu panda warrior hero in golden martial arts robes')
  },
  {
    id: 'asset-cyber-warrior',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/cyberpunk_warrior_v1',
    name: 'Cybernetic Exo-Warrior',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Cyberpunk warrior with futuristic glowing cyan armor, plasma sword, high contrast 3d render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.cyberWarrior,
    originalUrl: SAMPLE_ASSET_IMAGES.cyberWarrior,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.cyberWarrior),
    tags: ['cyberpunk', 'warrior', 'armor', 'character', 'sci-fi', 'glowing', 'humanoid', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-12T11:20:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.cyberWarrior),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.cyberWarrior, 'Cyberpunk warrior with futuristic glowing cyan armor')
  },
  {
    id: 'asset-dragon-lord',
    projectId: 'proj-dungeon-crawler',
    projectName: 'Dungeon Realm 3D',
    cloudinaryPublicId: 'gameforge/dragon_lord_boss',
    name: 'Infernal Dragon Overseer',
    assetType: 'Character',
    style: '3D Game Art',
    prompt: 'Mythic dark dragon lord with volcanic obsidian scales, molten fire wings, game boss render',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.dragonLord,
    originalUrl: SAMPLE_ASSET_IMAGES.dragonLord,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.dragonLord),
    tags: ['dragon', 'boss', 'monster', 'character', 'fantasy', 'fire', 'volcanic', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-14T08:45:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.dragonLord),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.dragonLord, 'Mythic dark dragon lord with volcanic obsidian scales')
  },
  {
    id: 'asset-scifi-city',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/neon_district_env',
    name: 'Neon Metropolis Alley',
    assetType: 'Environment',
    style: 'Photorealistic',
    prompt: 'Rain-soaked cyberpunk alleyway, towering neon skyscrapers, reflective puddles, dark atmosphere 8k',
    aspectRatio: '16:9',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.cyberCity,
    originalUrl: SAMPLE_ASSET_IMAGES.cyberCity,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.cyberCity),
    tags: ['cyberpunk', 'city', 'environment', 'neon', 'sci-fi', 'rain', 'level-design', 'cloudinary-ai'],
    width: 1920,
    height: 1080,
    format: 'jpg',
    createdAt: '2026-09-13T16:10:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.cyberCity),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.cyberCity, 'Rain-soaked cyberpunk alleyway')
  },
  {
    id: 'asset-scifi-blaster',
    projectId: 'proj-cyberpunk-rpg',
    projectName: 'Cyberpunk RPG 2099',
    cloudinaryPublicId: 'gameforge/plasma_blaster_v3',
    name: 'Hyperion Plasma Rifle',
    assetType: 'Item/Prop',
    style: '3D Game Art',
    prompt: 'Futuristic sci-fi energy blaster gun with glowing blue cartridge, game inventory prop item',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.sciFiBlaster,
    originalUrl: SAMPLE_ASSET_IMAGES.sciFiBlaster,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.sciFiBlaster),
    tags: ['weapon', 'item', 'prop', 'plasma', 'rifle', 'inventory', 'sci-fi', 'cloudinary-ai'],
    width: 1024,
    height: 1024,
    format: 'png',
    createdAt: '2026-09-14T19:30:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.sciFiBlaster),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.sciFiBlaster, 'Futuristic sci-fi energy blaster gun')
  },
  {
    id: 'asset-health-potion',
    projectId: 'proj-pixel-platformer',
    projectName: 'Pixel Knight Adventures',
    cloudinaryPublicId: 'gameforge/elixir_vitality',
    name: 'Elixir of Vitality',
    assetType: 'UI/Icon',
    style: 'Pixel Art',
    prompt: 'Glowing red health potion in crystal flask, retro pixel art icon, 16-bit game asset',
    aspectRatio: '1:1',
    thumbnailUrl: SAMPLE_ASSET_IMAGES.healthPotion,
    originalUrl: SAMPLE_ASSET_IMAGES.healthPotion,
    bgRemovedUrl: getBackgroundRemovedUrl(SAMPLE_ASSET_IMAGES.healthPotion),
    tags: ['potion', 'health', 'pixel-art', 'icon', 'ui', 'inventory', '16-bit', 'cloudinary-ai'],
    width: 512,
    height: 512,
    format: 'png',
    createdAt: '2026-09-15T07:12:00Z',
    smartCrops: getSmartCropVariants(SAMPLE_ASSET_IMAGES.healthPotion),
    variations: getGenerativeVariations(SAMPLE_ASSET_IMAGES.healthPotion, 'Glowing red health potion in crystal flask')
  }
];
