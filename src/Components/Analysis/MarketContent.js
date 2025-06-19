import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';
import Chat from '../../Component/Chat';
import remarkGfm from 'remark-gfm';

const MarketContent = ({ 
  activeTab, 
  handleTabClick, 
  isForex, 
  selectedAsset, 
  setSelectedAsset, 
  isAssetDropdownOpen, 
  setIsAssetDropdownOpen, 
  assetList,
  t,
  lang,
  currentUser,
  handleUpgradeClick,
  handleSignup,
  handleLogin,
  renderMainContent,
  showMobileMenu,
  setShowMobileMenu
}) => {
  return (
    <>
      {/* Top Navigation */}
      <div className="top-navigation">
        {currentUser ? (
          <>
            <div className="asset-selector" onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}>
              <div className="asset-selector">
                <span className="asset-top-navigation">{t('analysis.asset')}</span>
                <div className="asset-name-simple">
                  <img src={selectedAsset.icon} alt={selectedAsset.name} className="coin-icon" />
                  <span className="asset-name">{selectedAsset.name}</span>
                  <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
                </div>
                {isAssetDropdownOpen && (
                  <div className="crypto-dropdown">
                    {assetList.map((asset) => (
                      <div 
                        key={asset.symbol}
                        className="crypto-dropdown-item"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsAssetDropdownOpen(false);
                        }}
                      >
                        <img src={asset.icon} alt={asset.name} className="coin-icon" />
                        <span>{asset.name}</span>
                        <span className="crypto-symbol">{asset.symbol}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span 
                className="mobile-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="asset-selector" onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}>
              <div className="asset-selector">
                <span>{t('analysis.asset')}</span>
                <div className="asset-name-simple">
                  <img src={selectedAsset.icon} alt={selectedAsset.name} className="coin-icon" />
                  <span className="asset-name">{selectedAsset.name}</span>
                  <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
                </div>  
                {isAssetDropdownOpen && (
                  <div className="crypto-dropdown">
                    {assetList.map((asset) => (
                      <div 
                        key={asset.symbol}
                        className="crypto-dropdown-item"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setIsAssetDropdownOpen(false);
                        }}
                      >
                        <img src={asset.icon} alt={asset.name} className="coin-icon" />
                        <span>{asset.name}</span>
                        <span className="crypto-symbol">{asset.symbol}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span 
                className="mobile-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </span>
            </div>
          </>
        )}

        <div className="navigation-tabs">
          <div 
            className={`nav-tab ${activeTab === 'aiInfo' ? 'active' : ''}`}
            onClick={() => handleTabClick('aiInfo')}
          >
            <p>{t('analysis.aiInfo')}</p>
          </div>
          <div 
            className={`nav-tab ${activeTab === 'historyAnalysis' ? 'active' : ''}`}
            onClick={() => handleTabClick('historyAnalysis')}
          >
            <p>{t('analysis.historyAnalysis')}</p>
          </div>
          <div 
            className={`nav-tab ${activeTab === 'liveChat' ? 'active' : ''}`}
            onClick={() => handleTabClick('liveChat')}
          >
            <p>{t('analysis.liveChat.liveChat')}</p>
          </div>
        </div>

        {currentUser ? (
          <div className="upgrade-button">
            <button className="upgrade-btn" onClick={handleUpgradeClick}>
              {t('analysis.upgradeTraiOS')}
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="auth-button signup-btn" onClick={handleSignup}>{t('analysis.signUp')}</button>
            <button className="auth-button login-btn" onClick={handleLogin}>{t('analysis.logIn')}</button>
          </div>
        )}
      </div>

      {/* Chat Component */}
      {activeTab !== 'liveChat' ? (
        <Chat remarkPlugins={[remarkGfm]} asset={selectedAsset.symbol.toLowerCase()} lang={lang} />
      ) : (
        ''
      )}
      {/* Main Section */}
      <div className="main-section">
        {renderMainContent()}
      </div>
    </>
  );
};

export default MarketContent; 