'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const Authentication: React.FC = () => {
  const { register, isLoading, error } = useGameStore();
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }
    
    await register(username);
  };

  return (
    <div className="pixel-container max-w-md mx-auto p-6">
      <h2 className="text-center text-xl mb-6 text-white">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm mb-2 text-gray-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Choose a username"
            disabled={isLoading}
            minLength={3}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="pixel-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || username.trim().length < 3}
          >
            {isLoading ? 'Creating...' : 'Create Account & Wallet'}
          </button>
          
          <div className="text-xs text-center text-gray-400 mt-2">
            This will automatically create a blockchain wallet for you
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default Authentication; 