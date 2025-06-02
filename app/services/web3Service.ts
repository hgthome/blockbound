import { ethers } from 'ethers';
import { GameItem, ItemRarity, ItemType } from '@/types';
import { CONTRACT_ADDRESSES, GAME_ITEM_NFT_ABI } from '@/app/lib/web3Config';

// Type declarations for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<{ address: string; chainId: number }> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed! Please install MetaMask to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Initialize contract if we have a deployed address for this chain
      const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
      if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
        this.contract = new ethers.Contract(contractAddress, GAME_ITEM_NFT_ABI, this.signer);
      }

      return { address, chainId };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect to MetaMask. Please try again.');
    }
  }

  async switchToSepolia(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed!');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Sepolia network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Sepolia network');
      }
    }
  }

  async mintItemAsNFT(item: GameItem, userAddress: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected or contract not initialized');
    }

    try {
      // Convert item data to contract format
      const rarityMap: Record<ItemRarity, number> = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4
      };

      const typeMap: Record<ItemType, number> = {
        'weapon': 0,
        'armor': 1,
        'accessory': 2,
        'consumable': 3
      };

      const stats = {
        attack: Math.min(255, item.stats.attack),
        defense: Math.min(255, item.stats.defense),
        speed: Math.min(255, item.stats.speed),
        health: Math.min(255, item.stats.health),
        magic: Math.min(255, item.stats.magic),
        critChance: Math.min(255, item.stats.critChance)
      };

      // Create metadata for IPFS (in a real app, you'd upload this to IPFS)
      const metadata = {
        name: item.name,
        description: item.description,
        image: `data:application/json,${encodeURIComponent(JSON.stringify(item.pixelArt))}`,
        attributes: [
          { trait_type: 'Rarity', value: item.rarity },
          { trait_type: 'Type', value: item.type },
          { trait_type: 'Level', value: item.level },
          { trait_type: 'Attack', value: item.stats.attack },
          { trait_type: 'Defense', value: item.stats.defense },
          { trait_type: 'Speed', value: item.stats.speed },
          { trait_type: 'Health', value: item.stats.health },
          { trait_type: 'Magic', value: item.stats.magic },
          { trait_type: 'Crit Chance', value: item.stats.critChance }
        ]
      };

      // For demo purposes, we'll use a data URI. In production, upload to IPFS
      const tokenURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
      const pixelArtData = JSON.stringify(item.pixelArt);

      // Estimate gas
      const gasEstimate = await this.contract.mintItem.estimateGas(
        userAddress,
        item.name,
        item.description,
        stats,
        rarityMap[item.rarity],
        typeMap[item.type],
        item.level,
        pixelArtData,
        tokenURI
      );

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate * BigInt(120) / BigInt(100);

      // Mint the NFT
      const tx = await this.contract.mintItem(
        userAddress,
        item.name,
        item.description,
        stats,
        rarityMap[item.rarity],
        typeMap[item.type],
        item.level,
        pixelArtData,
        tokenURI,
        { gasLimit }
      );

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      return tx.hash;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw new Error('Failed to mint item as NFT. Please try again.');
    }
  }

  async getPlayerNFTs(playerAddress: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenIds = await this.contract.getPlayerItems(playerAddress);
      return tokenIds.map((id: bigint) => Number(id));
    } catch (error) {
      console.error('Failed to get player NFTs:', error);
      return [];
    }
  }

  async getNFTDetails(tokenId: number): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const details = await this.contract.getItemDetails(tokenId);
      return details;
    } catch (error) {
      console.error('Failed to get NFT details:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.signer !== null;
  }

  async getBalance(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.signer.provider.getBalance(await this.signer.getAddress());
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async getCurrentNetwork(): Promise<{ name: string; chainId: number }> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: Number(network.chainId)
      };
    } catch (error) {
      console.error('Failed to get network:', error);
      throw error;
    }
  }
}

// Global instance
export const web3Service = new Web3Service(); 