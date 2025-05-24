import { GameItem, ItemRarity, ItemStats, ItemType, PixelArt } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Names for generated items
const itemPrefixes = ['Ancient', 'Mighty', 'Blessed', 'Cursed', 'Ethereal', 'Void', 'Glowing', 'Rusty', 'Dragon', 'Mystic'];
const itemRoots = ['Sword', 'Shield', 'Amulet', 'Staff', 'Bow', 'Dagger', 'Helm', 'Armor', 'Ring', 'Gloves'];
const itemSuffixes = ['of Power', 'of Giants', 'of Wisdom', 'of Protection', 'of Haste', 'of the Whale', 'of Destruction', 'of Rage', 'of the Phoenix', 'of the Void'];

// Special attack names
const attackPrefixes = ['Blazing', 'Frozen', 'Thunder', 'Toxic', 'Shadow', 'Righteous', 'Arcane', 'Nature\'s', 'Blood', 'Spirit'];
const attackRoots = ['Strike', 'Bolt', 'Blast', 'Slash', 'Barrage', 'Burst', 'Wave', 'Pulse', 'Nova', 'Storm'];

// Rarity configuration
const rarityConfig: Record<ItemRarity, { color: string, statMultiplier: number, chance: number }> = {
  common: { color: '#a5a5a5', statMultiplier: 1, chance: 0.5 },
  uncommon: { color: '#4ade80', statMultiplier: 1.5, chance: 0.3 },
  rare: { color: '#3b82f6', statMultiplier: 2, chance: 0.15 },
  epic: { color: '#a855f7', statMultiplier: 3, chance: 0.04 },
  legendary: { color: '#f59e0b', statMultiplier: 5, chance: 0.01 },
};

// Color palettes for pixel art by rarity
const palettes: Record<ItemRarity, string[]> = {
  common: ['#a5a5a5', '#d1d1d1', '#666666', '#2b2b2b', '#ffffff'],
  uncommon: ['#4ade80', '#22c55e', '#15803d', '#166534', '#dcfce7'],
  rare: ['#3b82f6', '#60a5fa', '#2563eb', '#1e40af', '#dbeafe'],
  epic: ['#a855f7', '#c084fc', '#9333ea', '#6b21a8', '#f3e8ff'],
  legendary: ['#f59e0b', '#fbbf24', '#d97706', '#b45309', '#fef3c7'],
};

// Generate random number between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random item from array
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Determine item rarity based on chance
function determineRarity(): ItemRarity {
  const roll = Math.random();
  let cumulativeChance = 0;
  
  for (const [rarity, config] of Object.entries(rarityConfig)) {
    cumulativeChance += config.chance;
    if (roll <= cumulativeChance) {
      return rarity as ItemRarity;
    }
  }
  
  return 'common'; // Fallback
}

// Generate random stats for an item based on rarity
function generateStats(rarity: ItemRarity, itemType: ItemType): ItemStats {
  const multiplier = rarityConfig[rarity].statMultiplier;
  
  // Base stats
  let stats: ItemStats = {
    attack: randomInt(1, 5),
    defense: randomInt(1, 5),
    speed: randomInt(1, 5),
    health: randomInt(1, 5),
    magic: randomInt(1, 5),
    critChance: randomInt(1, 10),
  };
  
  // Adjust stats based on item type
  switch (itemType) {
    case 'weapon':
      stats.attack *= 2;
      stats.critChance += 5;
      break;
    case 'armor':
      stats.defense *= 2;
      stats.health += 2;
      break;
    case 'accessory':
      stats.speed *= 1.5;
      stats.magic += 3;
      break;
    case 'consumable':
      stats.health *= 2;
      break;
  }
  
  // Apply rarity multiplier to all stats
  return {
    attack: Math.round(stats.attack * multiplier),
    defense: Math.round(stats.defense * multiplier),
    speed: Math.round(stats.speed * multiplier),
    health: Math.round(stats.health * multiplier),
    magic: Math.round(stats.magic * multiplier),
    critChance: Math.min(90, Math.round(stats.critChance * multiplier)), // Cap crit chance at 90%
  };
}

// Generate special attack for rare+ items
function generateSpecialAttack(rarity: ItemRarity, stats: ItemStats) {
  if (rarity === 'common' || rarity === 'uncommon') {
    return undefined;
  }
  
  const attackName = `${randomPick(attackPrefixes)} ${randomPick(attackRoots)}`;
  const baseDamage = 10 + (stats.attack * 2) + (stats.magic * 1.5);
  
  return {
    name: attackName,
    description: `A powerful ${attackName.toLowerCase()} that deals massive damage.`,
    damage: Math.round(baseDamage * rarityConfig[rarity].statMultiplier),
    cooldown: Math.max(1, 5 - Math.floor(stats.speed / 10)) // Cooldown based on speed
  };
}

// Generate pixel art for an item
function generatePixelArt(rarity: ItemRarity, itemType: ItemType): PixelArt {
  const size = 16; // 16x16 pixel art
  const pixelArray: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  const palette = palettes[rarity];
  
  // Choose main color index (1) and accent color index (2, 3)
  // Background is 0, highlights are 4
  
  // Generate shape based on item type
  switch (itemType) {
    case 'weapon':
      createWeaponShape(pixelArray, size);
      break;
    case 'armor':
      createArmorShape(pixelArray, size);
      break;
    case 'accessory':
      createAccessoryShape(pixelArray, size);
      break;
    case 'consumable':
      createConsumableShape(pixelArray, size);
      break;
  }
  
  // Add some random noise for uniqueness
  addRandomDetails(pixelArray, size, rarity);
  
  return {
    pixels: pixelArray,
    palette,
  };
}

// Helper functions to generate pixel art shapes
function createWeaponShape(pixels: number[][], size: number) {
  // Handle (4-6 pixels)
  const handleStart = Math.floor(size / 2 - 1);
  const handleLength = randomInt(4, 6);
  for (let y = size - 3; y > size - 3 - handleLength; y--) {
    pixels[y][handleStart] = 2;
    pixels[y][handleStart + 1] = 2;
  }
  
  // Guard
  pixels[size - 3 - handleLength][handleStart - 1] = 3;
  pixels[size - 3 - handleLength][handleStart] = 3;
  pixels[size - 3 - handleLength][handleStart + 1] = 3;
  pixels[size - 3 - handleLength][handleStart + 2] = 3;
  
  // Blade
  const bladeLength = randomInt(5, 8);
  for (let y = size - 4 - handleLength; y > size - 4 - handleLength - bladeLength; y--) {
    pixels[y][handleStart] = 1;
    pixels[y][handleStart + 1] = 1;
    
    // Add edge detail
    if (Math.random() > 0.7) {
      pixels[y][handleStart - 1] = 4;
    }
    if (Math.random() > 0.7) {
      pixels[y][handleStart + 2] = 4;
    }
  }
  
  // Tip
  pixels[size - 4 - handleLength - bladeLength][handleStart] = 1;
  pixels[size - 4 - handleLength - bladeLength][handleStart + 1] = 1;
}

function createArmorShape(pixels: number[][], size: number) {
  // Create chest plate shape
  const centerX = Math.floor(size / 2);
  const topY = 4;
  const width = 8;
  const height = 10;
  
  // Main body
  for (let y = topY; y < topY + height; y++) {
    for (let x = centerX - Math.floor(width/2); x < centerX + Math.ceil(width/2); x++) {
      // Outline
      if (y === topY || y === topY + height - 1 || 
          x === centerX - Math.floor(width/2) || x === centerX + Math.ceil(width/2) - 1) {
        pixels[y][x] = 3;
      } else {
        pixels[y][x] = 1;
      }
    }
  }
  
  // Shoulder pads
  for (let x = centerX - Math.floor(width/2) - 2; x < centerX - Math.floor(width/2); x++) {
    pixels[topY + 1][x] = 2;
    pixels[topY + 2][x] = 2;
  }
  
  for (let x = centerX + Math.ceil(width/2); x < centerX + Math.ceil(width/2) + 2; x++) {
    pixels[topY + 1][x] = 2;
    pixels[topY + 2][x] = 2;
  }
  
  // Details
  pixels[topY + 3][centerX] = 4;
  pixels[topY + 4][centerX] = 4;
}

function createAccessoryShape(pixels: number[][], size: number) {
  // Create ring or amulet
  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);
  const radius = randomInt(3, 5);
  
  // Draw circle outline
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      if (distance < radius && distance > radius - 1.5) {
        pixels[y][x] = 1;
      }
    }
  }
  
  // Add gem in center
  pixels[centerY][centerX] = 3;
  
  // Add sparkles
  pixels[centerY - 2][centerX] = 4;
  pixels[centerY][centerX + 2] = 4;
  pixels[centerY + 2][centerX] = 4;
  pixels[centerY][centerX - 2] = 4;
}

function createConsumableShape(pixels: number[][], size: number) {
  // Create potion or scroll
  const centerX = Math.floor(size / 2);
  const topY = 5;
  
  // Potion bottle shape
  const bottleWidth = 6;
  const bottleHeight = 8;
  const neckWidth = 2;
  const neckHeight = 2;
  
  // Bottle neck
  for (let y = topY; y < topY + neckHeight; y++) {
    for (let x = centerX - Math.floor(neckWidth/2); x < centerX + Math.ceil(neckWidth/2); x++) {
      pixels[y][x] = 3;
    }
  }
  
  // Bottle body
  for (let y = topY + neckHeight; y < topY + neckHeight + bottleHeight; y++) {
    const widthAtRow = Math.min(
      bottleWidth,
      Math.round(bottleWidth * Math.sin((y - topY - neckHeight) / bottleHeight * Math.PI))
    );
    
    for (let x = centerX - Math.floor(widthAtRow/2); x < centerX + Math.ceil(widthAtRow/2); x++) {
      if (y === topY + neckHeight || y === topY + neckHeight + bottleHeight - 1 ||
          x === centerX - Math.floor(widthAtRow/2) || x === centerX + Math.ceil(widthAtRow/2) - 1) {
        pixels[y][x] = 2;
      } else {
        pixels[y][x] = 1;
      }
    }
  }
  
  // Liquid fill level
  const fillLevel = randomInt(3, 5);
  for (let y = topY + neckHeight + bottleHeight - fillLevel; y < topY + neckHeight + bottleHeight; y++) {
    const widthAtRow = Math.min(
      bottleWidth - 2,
      Math.round((bottleWidth - 2) * Math.sin((y - topY - neckHeight) / bottleHeight * Math.PI))
    );
    
    for (let x = centerX - Math.floor(widthAtRow/2); x < centerX + Math.ceil(widthAtRow/2); x++) {
      pixels[y][x] = 4;
    }
  }
}

function addRandomDetails(pixels: number[][], size: number, rarity: ItemRarity) {
  // Number of details based on rarity
  const numDetails = {
    common: 3,
    uncommon: 5,
    rare: 8,
    epic: 12,
    legendary: 16
  }[rarity];
  
  // Add some random pixels
  for (let i = 0; i < numDetails; i++) {
    const x = randomInt(0, size - 1);
    const y = randomInt(0, size - 1);
    
    // Only add detail if there's already something there (don't add to empty space)
    if (pixels[y][x] > 0) {
      // Higher chance of highlights for legendary items
      const colorIndex = rarity === 'legendary' ? 4 : randomInt(1, 4);
      pixels[y][x] = colorIndex;
    }
  }
}

// Main function to generate a random item
export function generateRandomItem(): GameItem {
  // Determine basic properties
  const rarity = determineRarity();
  const itemType = randomPick(['weapon', 'armor', 'accessory', 'consumable']) as ItemType;
  const level = randomInt(1, 10);
  
  // Generate name
  const usePrefix = Math.random() > 0.3;
  const useSuffix = Math.random() > 0.3;
  let name = '';
  
  if (usePrefix) {
    name += `${randomPick(itemPrefixes)} `;
  }
  
  name += randomPick(itemRoots);
  
  if (useSuffix) {
    name += ` ${randomPick(itemSuffixes)}`;
  }
  
  // Generate stats based on rarity and type
  const stats = generateStats(rarity, itemType);
  
  // Generate pixel art
  const pixelArt = generatePixelArt(rarity, itemType);
  
  // Generate special attack for rare+ items
  const specialAttack = generateSpecialAttack(rarity, stats);
  
  // Create item object
  const item: GameItem = {
    id: uuidv4(),
    name,
    description: `A ${rarity} ${itemType} with powerful attributes.`,
    stats,
    rarity,
    type: itemType,
    level,
    pixelArt,
    specialAttack,
  };
  
  return item;
} 