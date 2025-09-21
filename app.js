import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '@suiet/wallet-kit/style.css';
import './App.css';

import Home from './screens/Home.css';
import Posts from './screens/Posts.css';
import Store from './screens/Store.css';
import Settings from './screens/Settings.css';

const MainGame = () => {
  return (
    <BrowserRouter>
      {/* 게임 로직이 들어갈 부분 */}
      <div className="game-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      {/* 하단 네비게이션 바 */}
      <nav className="bottom-nav">
        <Link to="/">🏠<br/>Home</Link>
        <Link to="/posts">+<br/>Post</Link>
        <Link to="/store">🏪<br/>Store</Link>
        <Link to="/settings">⚙️<br/>Settings</Link>
      </nav>
    </BrowserRouter>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);

  // 지갑 연결 확인
  useEffect(() => {
  setTimeout(() => {
    checkWalletConnection();
  }, 500);
}, []);

  const checkWalletConnection = async () => {
    try {
      // Slush Wallet 확인
      if (window.slush) {
        const result = await window.slush.hasPermissions();
        if (result) {
          const accounts = await window.slush.getAccounts();
          if (accounts && accounts.length > 0) {
            setWallet(window.slush);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      }
      // Sui Wallet 확인
      else if (window.suiWallet) {
        const result = await window.suiWallet.hasPermissions();
        if (result) {
          const accounts = await window.suiWallet.getAccounts();
          if (accounts && accounts.length > 0) {
            setWallet(window.suiWallet);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      }
      // Suiet Wallet 확인
      else if (window.suiet) {
        const result = await window.suiet.hasPermissions();
        if (result) {
          const accounts = await window.suiet.getAccounts();
          if (accounts && accounts.length > 0) {
            setWallet(window.suiet);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      }
    } catch (error) {
      console.log('지갑 연결 확인 중 오류:', error);
    }
  };

  const connectWallet = async () => {
    console.log('지갑 연결 시도...');
    
    try {
      let selectedWallet = null;
      let result = null;

      // Slush Wallet 시도
      if (window.slush) {
        selectedWallet = window.slush;
        result = await selectedWallet.requestPermissions();
      }
      // Suiet Wallet 시도
      else if (window.suiet) {
        selectedWallet = window.suiet;
        result = await selectedWallet.requestPermissions();
      }
      // Ethos Wallet 시도
      else if (window.ethosWallet) {
        selectedWallet = window.ethosWallet;
        result = await selectedWallet.requestPermissions();
      }
      else {
        alert('설치된 Sui 지갑을 찾을 수 없습니다.\n\nSlush, Sui Wallet 또는 Suiet Wallet을 설치해주세요.');
        return;
      }

      if (result && result.accounts && result.accounts.length > 0) {
        setWallet(selectedWallet);
        setAccount(result.accounts[0]);
        setIsConnected(true);
        alert('지갑이 성공적으로 연결되었습니다!');
        console.log('연결된 계정:', result.accounts[0]);
      } else {
        alert('지갑 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('지갑 연결 오류:', error);
      if (error.message.includes('rejected')) {
        alert('사용자가 지갑 연결을 거부했습니다.');
      } else {
        alert('지갑 연결 중 오류가 발생했습니다.');
      }
    }
  };

  // 연결된 상태면 게임 화면 표시
  if (isConnected) {
    return (
      <div className="App">
        <MainGame />
      </div>
    );
  }

  // 연결되지 않은 상태면 시작 화면 표시
  return (
    <div className="App">
      <div className="start-screen">
        <div className="dragon-logo">🐲</div>
        
        <h1 className="game-title">Dragon Game</h1>
        
        <p className="game-subtitle">Connect your Sui Wallet to start playing</p>
        
        <button className="connect-wallet-btn" onClick={connectWallet}>
          <div className="wallet-icon"></div>
          Connect Sui Wallet
        </button>
        
        <p className="features-description">
          Connect your wallet to save your progress, earn tokens, and trade accessories with other players.
        </p>
        
        <div className="feature-icons">
          <div className="feature-item">
            <div className="feature-icon earn-tokens-icon">🪙</div>
            <div className="feature-label">Earn Tokens</div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon collect-items-icon">🛍️</div>
            <div className="feature-label">Collect Items</div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon share-posts-icon">📱</div>
            <div className="feature-label">Share Posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
