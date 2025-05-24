import { create } from 'zustand';
import { User, GameItem, CombatState } from '@/types';
import { generateRandomItem } from '@/app/utils/itemGenerator';
import { ethers } from 'ethers';

interface GameState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeItem: GameItem | null;
  enemyItem: GameItem | null;
  combatState: CombatState | null;
  error: string | null;
  
  // Authentication actions
  register: (username: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  
  // Item actions
  generateRandomItem: () => void;
  
  // Combat actions
  startCombat: () => void;
  attackEnemy: () => void;
  useSpecialAttack: () => void;
  endCombat: () => void;
}

const initialUser: User = {
  id: '',
  username: '',
  experience: 0,
  level: 1,
  wallet: '',
  inventory: [],
  equippedItem: undefined
};

const initialCombatState: CombatState = {
  playerHP: 100,
  enemyHP: 100,
  playerTurn: true,
  log: ['Combat has started!'],
  isOver: false
};

export const useGameStore = create<GameState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  activeItem: null,
  enemyItem: null,
  combatState: null,
  error: null,

  // Authentication
  register: async (username: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real application, this would connect to a backend
      // For now, we'll create a local user
      const newUserId = `user_${Date.now()}`;
      
      // Create a mock wallet using ethers
      const wallet = ethers.Wallet.createRandom();
      
      const newUser: User = {
        ...initialUser,
        id: newUserId,
        username,
        wallet: wallet.address,
      };
      
      // Wait for a second to simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        currentUser: newUser,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('blockbound_user', JSON.stringify(newUser));
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false
      });
    }
  },
  
  connectWallet: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would connect to MetaMask or another wallet
      // For demo purposes, we'll just simulate it
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If there's already a user, just update the wallet connection status
      const { currentUser } = get();
      if (currentUser) {
        set({
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error('User must register first');
      }
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
    
    // Add to user's inventory if logged in
    const { currentUser } = get();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        inventory: [...currentUser.inventory, newItem]
      };
      set({ currentUser: updatedUser });
      
      // Update localStorage
      localStorage.setItem('blockbound_user', JSON.stringify(updatedUser));
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
        localStorage.setItem('blockbound_user', JSON.stringify(updatedUser));
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
        localStorage.setItem('blockbound_user', JSON.stringify(updatedUser));
      }
    }
  },
  
  endCombat: () => {
    set({ 
      combatState: null,
      enemyItem: null
    });
  }
})); 