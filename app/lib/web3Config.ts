import { createConfig, http } from 'wagmi';
import { sepolia, mainnet, polygonAmoy } from 'wagmi/chains';
import { metaMask, injected } from 'wagmi/connectors';

// Contract addresses (you'll need to deploy and update these)
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || ''
} as const;

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http()
  },
});

// Contract ABI for the GameItemNFT contract
export const GAME_ITEM_NFT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rarity",
        "type": "uint8"
      }
    ],
    "name": "ItemMinted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "attack",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "defense",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "speed",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "health",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "magic",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "critChance",
            "type": "uint8"
          }
        ],
        "internalType": "struct GameItemNFT.ItemStats",
        "name": "stats",
        "type": "tuple"
      },
      {
        "internalType": "uint8",
        "name": "rarity",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "itemType",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "pixelArtData",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintItem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerItems",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getItemDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "attack",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "defense",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "speed",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "health",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "magic",
                "type": "uint8"
              },
              {
                "internalType": "uint8",
                "name": "critChance",
                "type": "uint8"
              }
            ],
            "internalType": "struct GameItemNFT.ItemStats",
            "name": "stats",
            "type": "tuple"
          },
          {
            "internalType": "uint8",
            "name": "rarity",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "itemType",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "level",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "pixelArtData",
            "type": "string"
          }
        ],
        "internalType": "struct GameItemNFT.GameItem",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 