# BlockBound - Blockchain RPG Adventure

A blockchain-powered RPG game where players can generate random items, engage in turn-based combat, and mint their items as NFTs on the blockchain. Built with Next.js, TypeScript, and Solidity.

## 🎮 Features

- **Random Item Generation**: Generate unique RPG items with pixel art, stats, and special abilities
- **Turn-based Combat**: Battle against AI enemies using your generated items
- **NFT Integration**: Mint your favorite items as NFTs on Ethereum and Polygon testnets
- **MetaMask Integration**: Connect your wallet to interact with the blockchain
- **Pixel Art Rendering**: Beautiful retro-style pixel art for all items
- **Progressive Leveling**: Gain experience and level up through combat

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Polygon, Solidity, Hardhat
- **Web3 Libraries**: Ethers.js, Wagmi, Viem
- **State Management**: Zustand
- **Smart Contracts**: OpenZeppelin ERC-721

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- **FREE testnet tokens** (no mainnet ETH required!)

### 1. Clone and Install

```bash
git clone <repository-url>
cd blockbound
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Ethereum Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key for deployment
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Next.js Configuration
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Get FREE Testnet Tokens 💰

Get SepoliaETH from these faucets:
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) - Requires Alchemy account

### 4. Smart Contract Deployment

Compile the smart contracts:
```bash
npm run compile
```

Deploy to Sepolia testnet:
```bash
npm run deploy:sepolia
```

After deployment, update the contract address in `app/lib/web3Config.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0xYOUR_SEPOLIA_CONTRACT_ADDRESS',
  [polygonAmoy.id]: '0xYOUR_AMOY_CONTRACT_ADDRESS', // Update this
} as const;
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Play

1. **Connect MetaMask**: Click "Connect MetaMask" and approve the connection
2. **Switch Network**: Switch to Sepolia testnet
3. **Register**: Enter a username to create your game profile
4. **Generate Items**: Click "Random Item" to generate unique RPG items
5. **Battle**: Use "Fight!" to engage in turn-based combat with AI enemies
6. **Mint NFTs**: Click "🎨 Mint as NFT" to mint your favorite items as blockchain NFTs
7. **Level Up**: Gain experience through combat to increase your level

## 🏗️ Smart Contract Architecture

### GameItemNFT Contract

The main smart contract (`contracts/GameItemNFT.sol`) is an ERC-721 NFT contract that stores:

- **Item Metadata**: Name, description, rarity, type, level
- **Item Stats**: Attack, defense, speed, health, magic, crit chance
- **Pixel Art Data**: JSON representation of the item's pixel art
- **Player Inventory**: Mapping of player addresses to their owned NFTs

Key functions:
- `mintItem()`: Mint a new item NFT
- `getPlayerItems()`: Get all NFTs owned by a player
- `getItemDetails()`: Get detailed information about an NFT

## 🎨 Game Mechanics

### Item Generation
- **5 Rarity Levels**: Common, Uncommon, Rare, Epic, Legendary
- **4 Item Types**: Weapon, Armor, Accessory, Consumable
- **6 Core Stats**: Attack, Defense, Speed, Health, Magic, Crit Chance
- **Procedural Pixel Art**: Unique 8x8 pixel art generated for each item

### Combat System
- **Turn-based**: Player and enemy alternate turns
- **Stat-based Damage**: Damage calculated from attack vs defense
- **Critical Hits**: Based on crit chance stat
- **Special Attacks**: Unique abilities for certain items
- **Experience Gain**: Level up through successful battles

### NFT Integration
- **On-chain Storage**: All item data stored directly on the blockchain
- **Metadata Standard**: ERC-721 compliant metadata with OpenSea compatibility
- **Gas Optimization**: Efficient contract design to minimize transaction costs
- **Multi-chain Support**: Deploy on Ethereum or Polygon for different cost profiles

## 🔧 Development

### Project Structure

```
blockbound/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── lib/               # Web3 configuration
│   ├── services/          # Web3 service layer
│   ├── store/             # Zustand state management
│   └── utils/             # Utility functions
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment scripts
├── types/                 # TypeScript type definitions
├── POLYGON_AMOY_SETUP.md  # Detailed testnet setup guide
└── public/               # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run compile` - Compile smart contracts
- `npm run deploy:sepolia` - Deploy to Sepolia testnet

### Testing

The application includes comprehensive error handling and user feedback for:
- MetaMask connection issues
- Network switching
- Transaction failures
- Gas estimation errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on testnet
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note**: This is a demo application for educational purposes. Always use test networks and never share private keys or seed phrases. For production use, implement additional security measures and thorough testing.
