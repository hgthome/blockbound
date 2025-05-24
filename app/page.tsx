'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import Authentication from './components/Authentication';
import UserProfile from './components/UserProfile';
import ItemCard from './components/ItemCard';
import CombatSystem from './components/CombatSystem';

export default function Home() {
  const { 
    isAuthenticated, 
    currentUser,
    activeItem, 
    generateRandomItem,
    startCombat,
    combatState
  } = useGameStore();
  
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Client-side hydration check
  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('blockbound_user');
    if (storedUser) {
      // Here we would normally dispatch an action to restore user session
      // For simplicity in this demo, we'll just set isHydrated to true
    }
    
    setIsHydrated(true);
  }, []);
  
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl text-white mb-2">BlockBound</h1>
        <p className="text-gray-400 text-sm">Blockchain-powered RPG Adventure</p>
      </header>
      
      {!isAuthenticated && (
        <Authentication />
      )}
      
      {isAuthenticated && currentUser && (
        <>
          <UserProfile />
          
          {combatState ? (
            <CombatSystem />
          ) : (
            <div className="pixel-container p-4">
              <div className="text-center mb-4">
                <h2 className="text-lg text-white mb-1">Generate Your Item</h2>
                <p className="text-sm text-gray-400">Click the button to generate a random RPG item</p>
              </div>
              
              <div className="flex justify-center mb-4">
                <button 
                  onClick={generateRandomItem} 
                  className="pixel-btn"
                >
                  Random Item
                </button>
              </div>
              
              {activeItem && (
                <div className="mb-4">
                  <ItemCard 
                    item={activeItem} 
                    className="max-w-xl mx-auto"
                    isActive
                  />
                  
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={startCombat}
                      className="pixel-btn bg-red-700 border-red-900 hover:bg-red-600 active:bg-red-800"
                    >
                      Fight!
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      <footer className="mt-12 text-center text-gray-500 text-xs">
        <p>&copy; 2025 BlockBound - Blockchain RPG Adventure</p>
      </footer>
    </div>
  );
}
