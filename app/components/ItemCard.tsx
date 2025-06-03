'use client';

import React from 'react';
import { GameItem } from '@/types';
import PixelArtRenderer from './PixelArtRenderer';

interface ItemCardProps {
  item: GameItem;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const rarityColors = {
  common: 'bg-gray-700 border-gray-500',
  uncommon: 'bg-green-900 border-green-700',
  rare: 'bg-blue-900 border-blue-700',
  epic: 'bg-purple-900 border-purple-700',
  legendary: 'bg-amber-900 border-amber-600',
};

const rarityTextColors = {
  common: 'text-gray-300',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  className = '',
  onClick,
  isActive = false,
}) => {
  const {
    name,
    description,
    stats,
    rarity,
    type,
    level,
    pixelArt,
    specialAttack,
    minted,
    txHash,
  } = item;

  return (
    <div
      className={`
        pixel-container ${rarityColors[rarity]} p-3 rounded relative
        ${onClick ? 'cursor-pointer hover:brightness-110 transition-all' : ''}
        ${isActive ? 'ring-2 ring-white ring-opacity-70' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-sm font-bold ${rarityTextColors[rarity]}`}>{name}</h3>
          <div className="flex gap-2">
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">{type}</span>
            {minted && (
              <span className="text-xs bg-purple-800 px-2 py-1 rounded text-purple-200">
                🎨 NFT
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-3">
          <PixelArtRenderer 
            pixelArt={pixelArt} 
            size={80} 
            animate={isActive}
          />
          
          <div className="flex-1">
            <div className="text-xs text-gray-300 mb-1">Level {level}</div>
            <div className="text-xs text-gray-400 mb-3">{description}</div>
            
            <div className="grid grid-cols-3 gap-x-2 gap-y-1">
              <StatLabel label="ATK" value={stats.attack} />
              <StatLabel label="DEF" value={stats.defense} />
              <StatLabel label="SPD" value={stats.speed} />
              <StatLabel label="HP" value={stats.health} />
              <StatLabel label="MAG" value={stats.magic} />
              <StatLabel label="CRIT" value={`${stats.critChance}%`} />
            </div>
          </div>
        </div>
        
        {specialAttack && (
          <div className="mt-1 bg-gray-800 p-2 rounded text-xs">
            <div className="font-bold text-amber-400 mb-1">Special: {specialAttack.name}</div>
            <div className="text-gray-300">{specialAttack.description}</div>
            <div className="mt-1 flex justify-between">
              <span>DMG: {specialAttack.damage}</span>
              <span>CD: {specialAttack.cooldown} turns</span>
            </div>
          </div>
        )}
        
        {/* Minted item details */}
        {minted && txHash && (
          <div className="mt-2 bg-purple-900/30 p-2 rounded text-xs border border-purple-700">
            <div className="text-purple-300 font-bold mb-1">🔗 On-Chain NFT</div>
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
              onClick={(e) => e.stopPropagation()}
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const StatLabel: React.FC<{ label: string; value: string | number }> = ({ 
  label, 
  value 
}) => (
  <div className="flex justify-between text-xs">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

export default ItemCard; 