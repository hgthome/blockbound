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
        <h1 className="text-2xl sm:text-3xl text-white mb-2">BlockBound</h1>
        <p className="text-gray-400 text-sm">Blockchain-powered RPG Adventure</p>
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
                    
                    <button 
                      onClick={handleMintNFT}
                      disabled={isMinting}
                      className="pixel-btn bg-purple-700 border-purple-900 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isMinting ? 'Minting...' : '🎨 Mint as NFT'}
                    </button>
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
