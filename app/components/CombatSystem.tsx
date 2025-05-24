'use client';

import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import ItemCard from './ItemCard';
import PixelArtRenderer from './PixelArtRenderer';

const CombatSystem: React.FC = () => {
  const { 
    activeItem,
    enemyItem,
    combatState,
    attackEnemy,
    useSpecialAttack,
    endCombat
  } = useGameStore();
  
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll combat log to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatState?.log]);

  if (!activeItem || !enemyItem || !combatState) return null;

  const { playerHP, enemyHP, playerTurn, log, isOver, winner } = combatState;
  
  // Calculate HP percentages
  const playerMaxHP = 100 + (activeItem.stats.health * 10);
  const enemyMaxHP = 100 + (enemyItem.stats.health * 10);
  
  const playerHPPercent = Math.max(0, Math.min(100, (playerHP / playerMaxHP) * 100));
  const enemyHPPercent = Math.max(0, Math.min(100, (enemyHP / enemyMaxHP) * 100));

  return (
    <div className="pixel-container p-4 mb-6">
      <h2 className="text-center text-lg text-white mb-4">Combat Arena</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm text-indigo-400 mb-2">Your Item</h3>
          <ItemCard item={activeItem} />
          
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white">HP</span>
              <span className="text-xs text-white">{playerHP}/{playerMaxHP}</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-sm overflow-hidden">
              <div 
                className={`h-full ${playerHPPercent > 50 ? 'bg-green-600' : playerHPPercent > 20 ? 'bg-yellow-600' : 'bg-red-600'}`}
                style={{ width: `${playerHPPercent}%` }}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm text-red-400 mb-2">Enemy Item</h3>
          <ItemCard item={enemyItem} />
          
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white">HP</span>
              <span className="text-xs text-white">{enemyHP}/{enemyMaxHP}</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-sm overflow-hidden">
              <div 
                className={`h-full ${enemyHPPercent > 50 ? 'bg-green-600' : enemyHPPercent > 20 ? 'bg-yellow-600' : 'bg-red-600'}`}
                style={{ width: `${enemyHPPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4 flex justify-center">
        <div className="flex items-center">
          <PixelArtRenderer pixelArt={activeItem.pixelArt} size={64} animate={playerTurn && !isOver} />
          <div className="text-xl text-white px-4">VS</div>
          <PixelArtRenderer pixelArt={enemyItem.pixelArt} size={64} animate={!playerTurn && !isOver} />
        </div>
      </div>
      
      {isOver && (
        <div className="mb-4 text-center">
          <div className={`text-xl ${winner === 'player' ? 'text-green-400' : 'text-red-400'} mb-2`}>
            {winner === 'player' ? 'Victory!' : 'Defeat!'}
          </div>
          <button
            onClick={endCombat}
            className="pixel-btn"
          >
            Return to Main Screen
          </button>
        </div>
      )}
      
      {!isOver && (
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={attackEnemy}
            disabled={!playerTurn || isOver}
            className="pixel-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Attack
          </button>
          
          {activeItem.specialAttack && (
            <button
              onClick={useSpecialAttack}
              disabled={!playerTurn || isOver}
              className="pixel-btn bg-amber-700 border-amber-900 hover:bg-amber-600 active:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activeItem.specialAttack.name}
            </button>
          )}
        </div>
      )}
      
      <div className="bg-gray-900 border border-gray-800 p-3 rounded-sm h-40 overflow-y-auto">
        <h3 className="text-sm text-white mb-2">Combat Log</h3>
        <div className="space-y-1">
          {log.map((entry, index) => (
            <div key={index} className="text-xs text-gray-300">{entry}</div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default CombatSystem; 