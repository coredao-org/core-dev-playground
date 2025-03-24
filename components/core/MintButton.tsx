import React from 'react';
import abi from './nft-claim.js';
import {ethers} from 'ethers';
import {useState, useEffect} from 'react';
import {Alert, Button, Col, Input, Space, Typography} from 'antd';
import Confetti from 'react-confetti';

declare let window: {
  removeEventListener(
    arg0: string,
    handleResize: () => void,
  ): void | {undefined: never};
  addEventListener(arg0: string, handleResize: () => void): unknown;
  innerHeight: number;
  innerWidth: number;
  ethereum?: ethers.providers.ExternalProvider;
};

const MintButton = () => {
  const contractAddress = '0x31568b2A19e7483e741D4D5CD750fa3F1ceE1ddc';
  const [fetching, setFetching] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const handleMint = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert('Please install MetaMask to mint your NFT!');
      alert('metamask present');
      return;
    }

    setFetching(true);
    setError(undefined);
    setTxHash(null);
    setShowConfetti(false);
    setNftImage(null);

    try {
      // Request account access if needed
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Create a new instance of your contract
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const user_addr = await signer.getAddress();
      const hasMinted = await contract.hasMinted(user_addr);

      if (!hasMinted) {
        // Call the mintCertificate function
        const transactionResult = await contract.mint({
          gasLimit: 500000, // Adjust as needed
        });
        alert('Transaction submitted. Waiting for confirmation...');

        // Wait for the transaction to be mined
        const receipt = await transactionResult.wait();
        setTxHash(receipt.transactionHash);
        //alert("NFT Minted Successfully!");

        // ToFetch the minted NFT metadata
        // Get latest token ID
        const tokenId = await contract.getCurrentTokenId();

        // Trigger confetti on successful mint
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000);
      } else {
        setError('You have already minted Core Builder NFT');
      }
    } catch (error: any) {
      console.error('Minting failed:', error.reason);
      // console.log(error.reason,"error")
      setError(error.message);
      // alert("Minting failed: " + error.message);
    }
    setFetching(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {showConfetti && (
          <Confetti
            height={window.innerHeight}
            width={window.innerWidth}
            numberOfPieces={300}
            recycle={false}
            style={{position: 'absolute', top: 0, left: 0, zIndex: 9999}}
          />
        )}
        <img
          src="https://gateway.pinata.cloud/ipfs/bafkreicqyal2zs7ivgywtpajpbi6irl6sgeakptywlcrnb4z4xab7equhy"
          alt="Minted NFT"
          style={{
            width: '200px',
            height: '200px',
            marginBottom: '10px',
            borderRadius: '10px',
          }}
        />

        <Button
          onClick={handleMint}
          loading={fetching}
          disabled={fetching}
          style={{
            padding: '0px 15px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Mint NFT
        </Button>
      </div>
      {txHash && (
        <Alert
          style={{marginTop: '1rem'}}
          message="Transaction Successful"
          description={`Transaction Hash: ${txHash}`}
          type="success"
          showIcon
        />
      )}
      {error && (
        <Alert
          style={{marginTop: '1rem'}}
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default MintButton;
