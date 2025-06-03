'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import ItemCard from './ItemCard';

const UserProfile: React.FC = () => {
  const { currentUser, activeItem } = useGameStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  if (!currentUser) return null;
  
  const { username, experience, level, wallet, inventory } = currentUser;
  
  // Calculate XP progress
  const xpForNextLevel = level * 100;
  const progress = Math.min(100, (experience / xpForNextLevel) * 100);
  
  // Pagination calculations
  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = inventory.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm text-gray-300">
              Inventory ({inventory.length} items)
            </h3>
            {totalPages > 1 && (
              <div className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {currentItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item}
                isActive={activeItem?.id === item.id}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="pixel-btn text-xs px-2 py-1 bg-gray-700 border-gray-900 hover:bg-gray-600 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`pixel-btn text-xs px-2 py-1 ${
                      currentPage === page
                        ? 'bg-indigo-700 border-indigo-900 text-white'
                        : 'bg-gray-700 border-gray-900 hover:bg-gray-600 active:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="pixel-btn text-xs px-2 py-1 bg-gray-700 border-gray-900 hover:bg-gray-600 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
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