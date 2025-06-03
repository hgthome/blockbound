export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ItemStats = {
  attack: number;
  defense: number;
  speed: number;
  health: number;
  magic: number;
  critChance: number;
};

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable';

export type PixelArt = {
  pixels: number[][];
  palette: string[];
};

export type GameItem = {
  id: string;
  name: string;
  description: string;
  stats: ItemStats;
  rarity: ItemRarity;
  type: ItemType;
  level: number;
  pixelArt: PixelArt;
  minted?: boolean;
  txHash?: string;
  specialAttack?: {
    name: string;
    description: string;
    damage: number;
    cooldown: number;
  };
};

export type User = {
  id: string;
  username: string;
  experience: number;
  level: number;
  wallet: string;
  inventory: GameItem[];
  equippedItem?: GameItem;
};

export type CombatState = {
  playerHP: number;
  enemyHP: number;
  playerTurn: boolean;
  log: string[];
  isOver: boolean;
  winner?: 'player' | 'enemy';
}; 