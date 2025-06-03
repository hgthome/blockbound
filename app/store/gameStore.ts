import { create } from 'zustand';
import { User, GameItem, CombatState } from '@/types';
import { generateRandomItem } from '@/app/utils/itemGenerator';
import { web3Service } from '@/app/services/web3Service';

interface GameState {
  currentUser: User | null;
  isLoading: boolean;
  activeItem: GameItem | null;
  enemyItem: GameItem | null;
  combatState: CombatState | null;
  error: string | null;
  
  // Web3 state
  walletAddress: string | null;
  chainId: number | null;
  isWalletConnected: boolean;
  isMinting: boolean;
  lastMintedTxHash: string | null;
  
  // Web3 actions
  connectWallet: (address: string, chainId: number) => Promise<void>;
  
  // Item actions
  generateRandomItem: () => void;
  mintItemAsNFT: (item: GameItem) => Promise<void>;
  
  // Combat actions
  startCombat: () => void;
  attackEnemy: () => void;
  useSpecialAttack: () => void;
  endCombat: () => void;
  
  // Utility actions
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialCombatState: CombatState = {
  playerHP: 100,
  enemyHP: 100,
  playerTurn: true,
  log: ['Combat has started!'],
  isOver: false
};

const createUserFromWallet = (walletAddress: string): User => {
  // Create a display name from wallet address
  const displayName = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return {
    id: walletAddress,
    username: displayName,
    experience: 0,
    level: 1,
    wallet: walletAddress,
    inventory: [],
    equippedItem: undefined
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  activeItem: null,
  enemyItem: null,
  combatState: null,
  error: null,
  
  // Web3 state
  walletAddress: null,
  chainId: null,
  isWalletConnected: false,
  isMinting: false,
  lastMintedTxHash: null,

  // Web3 connection - automatically creates user
  connectWallet: async (address: string, chainId: number) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user data exists in localStorage
      const storedUserKey = `blockbound_user_${address}`;
      const storedUser = localStorage.getItem(storedUserKey);
      
      let user: User;
      if (storedUser) {
        user = JSON.parse(storedUser);
        // Update wallet address in case it changed
        user.wallet = address;
      } else {
        // Create new user from wallet
        user = createUserFromWallet(address);
      }
      
      set({
        walletAddress: address,
        chainId,
        isWalletConnected: true,
        currentUser: user,
        isLoading: false
      });
      
      // Store user data with wallet-specific key
      localStorage.setItem(storedUserKey, JSON.stringify(user));
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
        isLoading: false
      });
    }
  },
  
  // Item generation
  generateRandomItem: () => {
    const newItem = generateRandomItem();
    set({ activeItem: newItem });
    
    // Add to user's inventory
    const { currentUser, walletAddress } = get();
    if (currentUser && walletAddress) {
      const updatedUser = {
        ...currentUser,
        inventory: [...currentUser.inventory, newItem]
      };
      set({ currentUser: updatedUser });
      
      // Update localStorage with wallet-specific key
      const storedUserKey = `blockbound_user_${walletAddress}`;
      localStorage.setItem(storedUserKey, JSON.stringify(updatedUser));
    }
  },
  
  // NFT Minting
  mintItemAsNFT: async (item: GameItem) => {
    const { walletAddress, chainId } = get();

    console.log('walletAddress', walletAddress);
    console.log('chainId', chainId);
    
    if (!walletAddress) {
      set({ error: 'Please connect your wallet first' });
      return;
    }
    
    if (chainId !== 11155111) { // Sepolia chain ID
      set({ error: 'Please switch to Sepolia testnet to mint NFTs' });
      return;
    }
    
    try {
      set({ isMinting: true, error: null });
      
      const txHash = await web3Service.mintItemAsNFT(item, walletAddress);
      
      set({ 
        isMinting: false, 
        lastMintedTxHash: txHash,
        error: null 
      });
      
      // Show success message
      setTimeout(() => {
        set({ lastMintedTxHash: null });
      }, 10000); // Clear after 10 seconds
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mint NFT',
        isMinting: false
      });
    }
  },

  // Combat
  startCombat: () => {
    const { activeItem } = get();
    if (!activeItem) return;
    
    // Generate an enemy with a random item
    const enemy = generateRandomItem();
    
    // Initial combat state based on stats
    const playerMaxHP = 100 + (activeItem.stats.health * 10);
    const enemyMaxHP = 100 + (enemy.stats.health * 10);
    
    set({
      enemyItem: enemy,
      combatState: {
        ...initialCombatState,
        playerHP: playerMaxHP,
        enemyHP: enemyMaxHP
      }
    });
  },
  
  attackEnemy: () => {
    const { combatState, activeItem, enemyItem, currentUser } = get();
    if (!combatState || !activeItem || !enemyItem || combatState.isOver) return;
    
    if (combatState.playerTurn) {
      // Calculate damage
      const damage = Math.max(5, activeItem.stats.attack * 5 - enemyItem.stats.defense * 2);
      const newEnemyHP = Math.max(0, combatState.enemyHP - damage);
      
      // Check for critical hit (based on critChance)
      const isCritical = Math.random() < (activeItem.stats.critChance / 100);
      const actualDamage = isCritical ? damage * 2 : damage;
      
      const combatLog = [
        ...combatState.log,
        isCritical 
          ? `Critical hit! You dealt ${actualDamage} damage!` 
          : `You attacked for ${actualDamage} damage!`
      ];
      
      const isOver = newEnemyHP <= 0;
      
      set({
        combatState: {
          ...combatState,
          enemyHP: newEnemyHP,
          playerTurn: !isOver, // If game is over, keep player's turn
          log: combatLog,
          isOver,
          winner: isOver ? 'player' : undefined
        }
      });
      
      // If enemy is not defeated, process enemy turn after delay
      if (!isOver) {
        setTimeout(() => {
          const { combatState } = get();
          if (!combatState || combatState.isOver) return;
          
          // Enemy attack calculation
          const enemyDamage = Math.max(3, enemyItem.stats.attack * 4 - activeItem.stats.defense * 2);
          const newPlayerHP = Math.max(0, combatState.playerHP - enemyDamage);
          
          const updatedLog = [
            ...combatState.log,
            `Enemy attacked for ${enemyDamage} damage!`
          ];
          
          const gameOver = newPlayerHP <= 0;
          
          set({
            combatState: {
              ...combatState,
              playerHP: newPlayerHP,
              playerTurn: true,
              log: updatedLog,
              isOver: gameOver,
              winner: gameOver ? 'enemy' : undefined
            }
          });
          
        }, 1000);
      } else if (currentUser) {
        // Player won, grant XP and update user
        const xpGained = 10 + (enemyItem.level * 5);
        const updatedUser = {
          ...currentUser,
          experience: currentUser.experience + xpGained,
          // Level up if XP threshold reached
          level: currentUser.experience + xpGained >= currentUser.level * 100 
            ? currentUser.level + 1 
            : currentUser.level
        };
        
        set({ currentUser: updatedUser });
        
        // Use wallet-specific localStorage key
        const { walletAddress } = get();
        if (walletAddress) {
          const storedUserKey = `blockbound_user_${walletAddress}`;
          localStorage.setItem(storedUserKey, JSON.stringify(updatedUser));
        }
      }
    }
  },
  
  useSpecialAttack: () => {
    const { combatState, activeItem, enemyItem, currentUser } = get();
    if (!combatState || !activeItem || !enemyItem || !activeItem.specialAttack || combatState.isOver) return;
    
    if (combatState.playerTurn) {
      // Special attack deals more damage than regular attack
      const specialDamage = activeItem.specialAttack.damage;
      const newEnemyHP = Math.max(0, combatState.enemyHP - specialDamage);
      
      const combatLog = [
        ...combatState.log,
        `You used ${activeItem.specialAttack.name} for ${specialDamage} damage!`
      ];
      
      const isOver = newEnemyHP <= 0;
      
      set({
        combatState: {
          ...combatState,
          enemyHP: newEnemyHP,
          playerTurn: !isOver,
          log: combatLog,
          isOver,
          winner: isOver ? 'player' : undefined
        }
      });
      
      // Enemy turn logic (same as in attack function)
      if (!isOver) {
        setTimeout(() => {
          const { combatState } = get();
          if (!combatState || combatState.isOver) return;
          
          const enemyDamage = Math.max(3, enemyItem.stats.attack * 4 - activeItem.stats.defense * 2);
          const newPlayerHP = Math.max(0, combatState.playerHP - enemyDamage);
          
          const updatedLog = [
            ...combatState.log,
            `Enemy attacked for ${enemyDamage} damage!`
          ];
          
          const gameOver = newPlayerHP <= 0;
          
          set({
            combatState: {
              ...combatState,
              playerHP: newPlayerHP,
              playerTurn: true,
              log: updatedLog,
              isOver: gameOver,
              winner: gameOver ? 'enemy' : undefined
            }
          });
        }, 1000);
      } else if (currentUser) {
        // Player won, grant XP
        const xpGained = 15 + (enemyItem.level * 5); // More XP for special attack win
        const updatedUser = {
          ...currentUser,
          experience: currentUser.experience + xpGained,
          level: currentUser.experience + xpGained >= currentUser.level * 100 
            ? currentUser.level + 1 
            : currentUser.level
        };
        
        set({ currentUser: updatedUser });
        
        // Use wallet-specific localStorage key
        const { walletAddress } = get();
        if (walletAddress) {
          const storedUserKey = `blockbound_user_${walletAddress}`;
          localStorage.setItem(storedUserKey, JSON.stringify(updatedUser));
        }
      }
    }
  },
  
  endCombat: () => {
    set({ 
      combatState: null,
      enemyItem: null
    });
  },
  
  // Utility actions
  setError: (error: string | null) => {
    set({ error });
  },
  
  clearError: () => {
    set({ error: null });
  }
})); 