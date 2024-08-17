import React, { createContext, useState, useContext } from 'react';

// Create a context
const WalletContext = createContext();

// Create a provider component
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');

  return (
    <WalletContext.Provider value={{ account, setAccount }}>
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook for using the context
export const useWallet = () => useContext(WalletContext);
