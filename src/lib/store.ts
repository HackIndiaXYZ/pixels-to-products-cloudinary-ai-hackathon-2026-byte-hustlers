import { GameAsset, Project, AssetType, AssetStyle, AspectRatio } from '@/types/gameforge';
import { INITIAL_PROJECTS, INITIAL_ASSETS } from './mock-data';
import { generateCloudinaryTags, getSmartCropVariants, getGenerativeVariations, getBackgroundRemovedUrl } from './cloudinary';
import { enhanceGamePrompt } from './prompt-enhancer';
import { getPhotorealistic3DRender } from './render-resolver';

const LOCAL_STORAGE_KEY_ASSETS = 'gameforge_assets_v1';
const LOCAL_STORAGE_KEY_PROJECTS = 'gameforge_projects_v1';

export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
    if (data) {
      const parsed: Project[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load projects from localStorage', e);
  }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to localStorage', e);
  }
}

export function getStoredAssets(): GameAsset[] {
  if (typeof window === 'undefined') return INITIAL_ASSETS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_ASSETS);
    if (data) {
      const parsed: GameAsset[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          saveAssets(INITIAL_ASSETS);
          return INITIAL_ASSETS;
        }

        const initialMap = new Map(INITIAL_ASSETS.map((a) => [a.id, a]));

        // Refresh and heal all assets with photorealistic 3D AAA game renders
        const refreshed = parsed.map((asset) => {
          const init = initialMap.get(asset.id);
          if (init) {
            return {
              ...init,
              isFavorite: asset.isFavorite ?? init.isFavorite,
              projectId: asset.projectId || init.projectId,
              projectName: asset.projectName || init.projectName,
            };
          }

          // Heal any asset that has SVG render, broken pollinations, or old Unsplash URL
          const isSvg = (asset.thumbnailUrl && asset.thumbnailUrl.includes('/api/asset-render')) ||
                        (asset.originalUrl && asset.originalUrl.includes('/api/asset-render'));
          const isPollinations = (asset.originalUrl && asset.originalUrl.includes('image.pollinations.ai') && !asset.originalUrl.includes('/api/image-proxy'));
          const isUnsplash = (asset.originalUrl && asset.originalUrl.includes('images.unsplash.com')) ||
                             (asset.thumbnailUrl && asset.thumbnailUrl.includes('images.unsplash.com'));

          if (isSvg || isPollinations || isUnsplash || !asset.thumbnailUrl) {
            const realistic3DRender = getPhotorealistic3DRender(
              `${asset.name} ${asset.prompt || ''}`,
              asset.assetType
            );
            return {
              ...asset,
              thumbnailUrl: realistic3DRender,
              originalUrl: realistic3DRender,
              bgRemovedUrl: getBackgroundRemovedUrl(realistic3DRender),
              smartCrops: getSmartCropVariants(realistic3DRender),
              variations: getGenerativeVariations(realistic3DRender, asset.name),
            };
          }
          return asset;
        });

        // Add any missing initial assets
        const existingIds = new Set(refreshed.map((a) => a.id));
        const missingInitial = INITIAL_ASSETS.filter((a) => !existingIds.has(a.id));
        const finalAssets = missingInitial.length > 0 ? [...missingInitial, ...refreshed] : refreshed;

        saveAssets(finalAssets);
        return finalAssets;
      }
    }
  } catch (e) {
    console.error('Failed to load assets from localStorage', e);
  }
  return INITIAL_ASSETS;
}

export function saveAssets(assets: GameAsset[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ASSETS, JSON.stringify(assets));
  } catch (e) {
    console.error('Failed to save assets to localStorage', e);
  }
}

export function toggleFavorite(assetId: string): GameAsset | null {
  const assets = getStoredAssets();
  let updatedAsset: GameAsset | null = null;
  const updated = assets.map((a) => {
    if (a.id === assetId) {
      updatedAsset = { ...a, isFavorite: !a.isFavorite };
      return updatedAsset;
    }
    return a;
  });
  saveAssets(updated);
  return updatedAsset;
}

export function resolvePromptImageUrl(prompt: string, assetType: AssetType, style?: AssetStyle): string {
  return getPhotorealistic3DRender(prompt, assetType);
}

export function createNewAsset(params: {
  projectId: string;
  name: string;
  prompt: string;
  assetType: AssetType;
  style: AssetStyle;
  aspectRatio: AspectRatio;
  /** Real image URL from the generation API. Falls back to prompt-matched stock image when omitted. */
  imageUrl?: string;
  /** Cloudinary public_id if the image was uploaded to Cloudinary */
  cloudinaryPublicId?: string;
  /** f_auto,q_auto optimized URL from Cloudinary */
  optimizedUrl?: string | null;
  /** Background-removed URL from Cloudinary */
  bgRemovedUrl?: string | null;
  /** Tags from Cloudinary or prompt-derived */
  tags?: string[];
  /** Whether actually uploaded to Cloudinary */
  cloudinaryUploaded?: boolean;
  /** Provider used */
  provider?: 'pollinations+cloudinary' | 'pollinations' | 'user-upload';
  /** Parent asset ID for variations */
  parentAssetId?: string;
}): GameAsset {
  const projects = getStoredProjects();
  const proj = projects.find(p => p.id === params.projectId) || projects[0];

  const imageUrl = params.imageUrl ?? resolvePromptImageUrl(params.prompt, params.assetType, params.style);

  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  // Use the real Cloudinary public_id if provided, otherwise generate a local one
  const publicId = params.cloudinaryPublicId
    ?? `gameforge/${params.assetType.toLowerCase().replace(/[^a-z]/g, '')}_${uniqueSuffix}`;
  const tags = params.tags ?? generateCloudinaryTags(params.prompt, params.assetType, params.style);

  // Use real Cloudinary bg-removed URL if available, otherwise build a URL-based one
  const bgRemovedUrl = params.bgRemovedUrl ?? getBackgroundRemovedUrl(imageUrl);
  const smartCrops = getSmartCropVariants(imageUrl);
  const variations = getGenerativeVariations(imageUrl, params.prompt);

  const newAsset: GameAsset = {
    id: `asset-${uniqueSuffix}`,
    projectId: proj.id,
    projectName: proj.name,
    cloudinaryPublicId: publicId,
    name: params.name || `${params.style} ${params.assetType}`,
    assetType: params.assetType,
    style: params.style,
    prompt: params.prompt,
    aspectRatio: params.aspectRatio,
    thumbnailUrl: params.optimizedUrl ?? imageUrl,
    originalUrl: imageUrl,
    bgRemovedUrl: bgRemovedUrl,
    optimizedUrl: params.optimizedUrl ?? null,
    tags: tags,
    width: params.aspectRatio === '16:9' ? 1920 : 1024,
    height: params.aspectRatio === '16:9' ? 1080 : 1024,
    format: 'png',
    cloudinaryUploaded: params.cloudinaryUploaded ?? false,
    provider: params.provider ?? 'pollinations',
    parentAssetId: params.parentAssetId,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    smartCrops: smartCrops,
    variations: variations
  };

  const assets = getStoredAssets();
  const updatedAssets = [newAsset, ...assets];
  saveAssets(updatedAssets);

  // Update project count
  const updatedProjects = projects.map(p => {
    if (p.id === proj.id) {
      return {
        ...p,
        assetCount: p.assetCount + 1,
        characterCount: params.assetType === 'Character' ? p.characterCount + 1 : p.characterCount,
        environmentCount: params.assetType === 'Environment' ? p.environmentCount + 1 : p.environmentCount
      };
    }
    return p;
  });
  saveProjects(updatedProjects);

  return newAsset;
}

/**
 * Creates a complete "Asset Pack" in one click! (Hackathon Winning Feature)
 *
 * @param imageUrls - Optional array of real image URLs from the generation API,
 *   one per pack item. Falls back to prompt-matched stock images when omitted.
 */
export function createAssetPack(params: {
  projectId: string;
  packName: string;
  prompt: string;
  assetType: AssetType;
  style: AssetStyle;
  imageUrls?: string[];
  cloudinaryPublicIds?: (string | undefined)[];
  optimizedUrls?: (string | null | undefined)[];
  bgRemovedUrls?: (string | null | undefined)[];
  tagSets?: string[][];
  cloudinaryUploaded?: boolean;
  provider?: 'pollinations+cloudinary' | 'pollinations' | 'user-upload';
}): GameAsset[] {
  const packName = params.packName || 'Cyberpunk Warrior Pack';

  const basePrompt = params.prompt;
  const assetType = params.assetType;
  const style = params.style;

  const packItems = [
    {
      name: `${packName} - Full Body Character`,
      prompt: `${basePrompt}, full body standing stance, game character model`,
      type: assetType,
      aspectRatio: '1:1' as AspectRatio
    },
    {
      name: `${packName} - UI Portrait (512×512)`,
      prompt: `${basePrompt}, headshot hero portrait, character icon`,
      type: assetType,
      aspectRatio: '1:1' as AspectRatio
    },
    {
      name: `${packName} - Inventory Icon (256×256)`,
      prompt: `${basePrompt}, character inventory gear icon`,
      type: assetType,
      aspectRatio: '1:1' as AspectRatio
    }
  ];

  const generatedPackAssets: GameAsset[] = [];

  for (let i = 0; i < packItems.length; i++) {
    const item = packItems[i];
    const asset = createNewAsset({
      projectId: params.projectId,
      name: item.name,
      prompt: item.prompt,
      assetType: item.type,
      style: style,
      aspectRatio: item.aspectRatio,
      imageUrl:           params.imageUrls?.[i],
      cloudinaryPublicId: params.cloudinaryPublicIds?.[i],
      optimizedUrl:       params.optimizedUrls?.[i] ?? null,
      bgRemovedUrl:       params.bgRemovedUrls?.[i] ?? null,
      tags:               params.tagSets?.[i],
      cloudinaryUploaded: params.cloudinaryUploaded,
      provider:           params.provider,
    });
    asset.isPack = true;
    asset.packName = packName;
    generatedPackAssets.push(asset);
  }

  return generatedPackAssets;
}
