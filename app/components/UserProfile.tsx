'use client';

import React from 'react';
import { useGameStore } from '../store/gameStore';
import ItemCard from './ItemCard';

const UserProfile: React.FC = () => {
  const { currentUser, activeItem } = useGameStore();
  
  if (!currentUser) return null;
  
  const { username, experience, level, wallet, inventory } = currentUser;
  
  // Calculate XP progress
  const xpForNextLevel = level * 100;
  const progress = Math.min(100, (experience / xpForNextLevel) * 100);
  
  return (
    <div className="pixel-container p-4 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg text-white">{username}</h2>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400 mr-2">Level {level}</span>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 ml-2">
              {experience}/{xpForNextLevel} XP
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400">Wallet</div>
          <div className="text-xs text-indigo-400 font-mono truncate w-32">
            {wallet.substring(0, 8)}...{wallet.substring(wallet.length - 6)}
          </div>
        </div>
      </div>
      
      {inventory.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-300 mb-2">Inventory ({inventory.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inventory.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item}
                isActive={activeItem?.id === item.id}
              />
            ))}
          </div>
        </div>
      )}
      
      {inventory.length === 0 && (
        <div className="text-center py-3 text-gray-400 text-sm">
          Your inventory is empty. Generate items to begin!
        </div>
      )}
    </div>
  );
};

export default UserProfile; 