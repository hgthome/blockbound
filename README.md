# BlockBound - Blockchain RPG Adventure

BlockBound is a web-based RPG game with blockchain integration, randomized item generation, turn-based combat, and pixel art graphics.

## Features

- **Blockchain Authentication**: Create an account directly on the site with an automatically generated wallet
- **Randomized Item Generation**: Generate unique RPG items with pixel art designs
- **Turn-based Combat System**: Battle against AI opponents with combat mechanics inspired by classic RPGs
- **Character Progression**: Gain experience and level up through combat victories
- **Pixel Art Graphics**: Beautiful retro-style visuals throughout the application

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Blockchain Integration**: Ethers.js
- **Pixel Art**: Custom pixel art generator

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockbound.git
   cd blockbound
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

1. **Create an Account**: Register with a username to generate your blockchain wallet
2. **Generate Items**: Click the "Random Item" button to create unique RPG items
3. **Battle**: Use your items to fight against enemies in turn-based combat
4. **Level Up**: Win battles to gain experience and increase your character level
5. **Collect Items**: Build your inventory with a variety of weapons, armor, and accessories

## Project Structure

- `/app` - Next.js app directory with pages and components
- `/app/components` - React components for the game interface
- `/app/store` - State management with Zustand
- `/app/utils` - Utility functions, including the item generator
- `/types` - TypeScript type definitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pixel art inspiration from classic RPGs like Earthbound and Pokémon
- Combat mechanics influenced by traditional turn-based JRPGs
