import React from 'react';

function Claim() {
  const handleClaimTokens = async () => {
    // Logic to claim tokens
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Claim Tokens</h2>
      <button
        onClick={handleClaimTokens}
        className="bg-blue-600 text-white p-2"
      >
        Claim Tokens
      </button>
    </div>
  );
}

export default Claim;
