'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import UserProfile from './components/UserProfile';
import ItemCard from './components/ItemCard';
import CombatSystem from './components/CombatSystem';
import MetaMaskConnect from './components/MetaMaskConnect';

export default function Home() {
  const { 
    currentUser,
    activeItem, 
    generateRandomItem,
    startCombat,
    combatState,
    // Web3 state
    isWalletConnected,
    isMinting,
    lastMintedTxHash,
    error,
    // Web3 actions
    connectWallet,
    mintItemAsNFT,
    setError,
    clearError
  } = useGameStore();
  
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Client-side hydration check
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleWalletConnect = async (address: string, chainId: number) => {
    try {
      await connectWallet(address, chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleWalletError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleMintNFT = async () => {
    if (!activeItem) return;
    
    try {
      await mintItemAsNFT(activeItem);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    }
  };
  
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
        <div className="relative inline-block">
          {/* Main Logo */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 relative">
            {/* Background glow effect */}
            <span className="absolute inset-0 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text blur-sm opacity-50">
              BlockBound
            </span>
            {/* Main text with blocky styling */}
            <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-mono tracking-wider">
              BlockBound
            </span>
            {/* Pixel accent dots */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 opacity-80"></div>
            <div className="absolute top-2 -left-1 w-1 h-1 bg-green-400 opacity-60"></div>
            <div className="absolute -bottom-1 left-1/3 w-1 h-1 bg-red-400 opacity-70"></div>
          </h1>
          
          {/* Decorative pixel border */}
          <div className="flex justify-center items-center gap-1 mb-3">
            <div className="w-2 h-2 bg-blue-500"></div>
            <div className="w-1 h-1 bg-purple-500"></div>
            <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
            <div className="w-3 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div className="w-1 h-1 bg-purple-500"></div>
            <div className="w-2 h-2 bg-blue-500"></div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm sm:text-base font-mono">
          <span className="text-blue-400">⛓️</span> Blockchain-powered RPG Adventure <span className="text-purple-400">🎮</span>
        </p>
        
        {/* Subtle animated background elements */}
        <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400 opacity-30 animate-pulse"></div>
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-purple-400 opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-12 left-1/2 w-1 h-1 bg-indigo-400 opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="pixel-container p-4 mb-6 bg-red-900/50 border-red-700">
          <div className="flex justify-between items-center">
            <p className="text-red-300 text-sm">{error}</p>
            <button 
              onClick={clearError}
              className="text-red-400 hover:text-red-300 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Success Message for Minted NFT */}
      {lastMintedTxHash && (
        <div className="pixel-container p-4 mb-6 bg-green-900/50 border-green-700">
          <div className="text-center">
            <p className="text-green-300 text-sm mb-2">
              🎉 NFT minted successfully!
            </p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${lastMintedTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 text-xs underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}
      
      {/* MetaMask Connection */}
      {!isWalletConnected && (
        <MetaMaskConnect 
          onConnect={handleWalletConnect}
          onError={handleWalletError}
        />
      )}
      
      {/* Main Game Content - show once wallet is connected */}
      {isWalletConnected && currentUser && (
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
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <button 
                      onClick={startCombat}
                      className="pixel-btn bg-red-700 border-red-900 hover:bg-red-600 active:bg-red-800"
                    >
                      Fight!
                    </button>
                    
                    {!activeItem.minted && (
                      <button 
                        onClick={handleMintNFT}
                        disabled={isMinting}
                        className="pixel-btn bg-purple-700 border-purple-900 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMinting ? 'Minting...' : '🎨 Mint as NFT'}
                      </button>
                    )}
                    
                    {activeItem.minted && (
                      <div className="pixel-btn bg-green-700 border-green-900 cursor-default">
                        ✅ Already Minted
                      </div>
                    )}
                  </div>
                  
                  {isMinting && (
                    <div className="text-center mt-4">
                      <p className="text-yellow-400 text-sm">
                        ⏳ Minting your item as an NFT... Please confirm the transaction in MetaMask
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      <footer className="mt-12 text-center text-gray-500 text-xs">
        <p>&copy; 2025 BlockBound - Blockchain RPG Adventure</p>
        <p className="mt-1">
          Items are minted as NFTs on Sepolia testnet • 
          <a 
            href="https://sepoliafaucet.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 ml-1"
          >
            Get Sepolia ETH
          </a>
        </p>
      </footer>
    </div>
  );
}
