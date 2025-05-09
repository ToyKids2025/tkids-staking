
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';

const MINT_TKIDS = new PublicKey('GcFRKjXfZtNd8uoQfrH3Cm2fswUzn8rwGrPio8RWxLYN'); // Devnet mint TKIDS
const connection = new Connection('https://api.devnet.solana.com');

export default function StakingApp() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;
      try {
        const ata = await PublicKey.findProgramAddressSync(
          [publicKey.toBuffer(), Buffer.from("tokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), MINT_TKIDS.toBuffer()],
          new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5Z4JcXjV93bCy1nkjL")
        );
        const account = await connection.getTokenAccountBalance(ata[0]);
        setBalance(account.value.uiAmount);
      } catch (e) {
        setBalance(0);
      }
    };
    fetchBalance();
  }, [publicKey]);

  const pools = [
    { days: 7, apr: '10%', userLimit: '1M', poolLimit: 10_000_000, rewardMax: '1M', filled: 0.2 },
    { days: 14, apr: '15%', userLimit: '2M', poolLimit: 20_000_000, rewardMax: '3M', filled: 0.35 },
    { days: 30, apr: '25%', userLimit: '3M', poolLimit: 30_000_000, rewardMax: '7.5M', filled: 0.5 },
    { days: 60, apr: '50%', userLimit: '4M', poolLimit: 17_000_000, rewardMax: '8.5M', filled: 0.6 },
    { days: 90, apr: '80%', userLimit: '5M', poolLimit: 37_500_000, rewardMax: '30M', filled: 0.85 }
  ];

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>TKIDS Staking Pools</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <WalletMultiButton />
          <button onClick={() => window.open('https://jup.ag', '_blank')} style={{
            backgroundColor: '#0f0', padding: '0.5rem 1rem', borderRadius: '8px',
            fontWeight: 'bold', cursor: 'pointer'
          }}>
            🛒 Buy TKIDS
          </button>
        </div>
      </div>
      {connected && publicKey && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          💰 Your TKIDS Balance: {balance ?? 'Loading...'}
        </p>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {pools.map((pool, i) => (
          <div key={i} style={{
            background: '#111', padding: '1rem', borderRadius: '12px', width: '220px',
            boxShadow: '0 0 8px #0f0', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <h2>{pool.days} Days</h2>
            <p>APR: {pool.apr}</p>
            <p>User Limit: {pool.userLimit} TKIDS</p>
            <p>Pool Limit: {pool.poolLimit.toLocaleString()} TKIDS</p>
            <p>Reward Max: {pool.rewardMax} TKIDS</p>
            <div style={{ width: '100%', background: '#333', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                width: `${pool.filled * 100}%`,
                height: '10px',
                backgroundColor: '#0f0',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            <input placeholder="Amount to stake" style={{ marginBottom: '10px', padding: '5px', width: '100%' }} />
            <button style={{ background: '#0f0', marginBottom: '5px', padding: '5px 10px', borderRadius: '6px' }}>Stake</button>
            <button style={{ background: '#0f0', padding: '5px 10px', borderRadius: '6px' }}>Unstake</button>
          </div>
        ))}
      </div>
    </div>
  );
}
