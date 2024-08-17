// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Superchain.Exchange</h1>
        <div>
          <Link to="/" className="mr-4 hover:underline">Home</Link>
          <Link to="/token-sale" className="mr-4 hover:underline">Token Sale</Link>
          <Link to="/claim" className="mr-4 hover:underline">Claim</Link>
          <Link to="/vesting" className="mr-4 hover:underline">Vesting</Link>
          <Link to="/connect-wallet" className="hover:underline">Connect Wallet</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
