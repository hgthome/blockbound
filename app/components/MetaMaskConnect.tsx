'use client';

import { useState, useEffect } from 'react';
import { web3Service } from '@/app/services/web3Service';

interface MetaMaskConnectProps {
  onConnect: (address: string, chainId: number) => void;
  onError: (error: string) => void;
}

export default function MetaMaskConnect({ onConnect, onError }: MetaMaskConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [network, setNetwork] = useState<{ name: string; chainId: number } | null>(null);
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (web3Service.isConnected()) {
      try {
        const networkInfo = await web3Service.getCurrentNetwork();
        const walletBalance = await web3Service.getBalance();
        setNetwork(networkInfo);
        setBalance(walletBalance);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const { address, chainId } = await web3Service.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      
      const networkInfo = await web3Service.getCurrentNetwork();
      const walletBalance = await web3Service.getBalance();
      setNetwork(networkInfo);
      setBalance(walletBalance);
      
      onConnect(address, chainId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      onError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      await web3Service.switchToSepolia();
      // Refresh network info after switching
      setTimeout(async () => {
        const networkInfo = await web3Service.getCurrentNetwork();
        setNetwork(networkInfo);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      onError(errorMessage);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(4);
  };

  if (isConnected) {
    return (
      <div className="pixel-container p-4 mb-6">
        <div className="text-center">
          <h3 className="text-lg text-white mb-3">🦊 Wallet Connected</h3>
          
          <div className="space-y-2 text-sm">
            <div className="text-gray-300">
              <span className="text-gray-400">Address:</span> {formatAddress(walletAddress)}
            </div>
            
            {network && (
              <div className="text-gray-300">
                <span className="text-gray-400">Network:</span> {network.name} (Chain ID: {network.chainId})
              </div>
            )}
            
            <div className="text-gray-300">
              <span className="text-gray-400">Balance:</span> {formatBalance(balance)} ETH
            </div>
          </div>

          {network && network.chainId !== 11155111 && ( // Sepolia chain ID
            <div className="mt-4">
              <p className="text-yellow-400 text-sm mb-2">
                ⚠️ Please switch to Sepolia testnet for NFT minting
              </p>
              <button
                onClick={switchToSepolia}
                className="pixel-btn bg-yellow-700 border-yellow-900 hover:bg-yellow-600 active:bg-yellow-800 text-sm"
              >
                Switch to Sepolia
              </button>
            </div>
          )}

          {network && network.chainId === 11155111 && (
            <div className="mt-4">
              <p className="text-green-400 text-sm">
                ✅ Connected to Sepolia testnet - Ready to mint NFTs!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-container p-6 text-center">
      <div className="mb-4">
        <h3 className="text-xl text-white mb-2">🦊 Connect MetaMask</h3>
        <p className="text-gray-400 text-sm">
          Connect your MetaMask wallet to mint items as NFTs on the blockchain
        </p>
      </div>

      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="pixel-btn bg-orange-700 border-orange-900 hover:bg-orange-600 active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>Make sure you have MetaMask installed and some Sepolia ETH for gas fees</p>
        <p className="mt-1">
          Get Sepolia ETH from: 
          <a 
            href="https://sepoliafaucet.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 ml-1"
          >
            Sepolia Faucet
          </a>
        </p>
      </div>
    </div>
  );
} 