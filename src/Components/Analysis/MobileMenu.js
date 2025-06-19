import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons';

const MobileMenu = ({
  activeMarket,
  handleMarketClick,
  userMobileDropdownRef,
  showMobileUserDropdown,
  setShowMobileUserDropdown,
  selectedLanguage,
  changeLanguage,
  currentUser,
  handleUpgradeClick,
  handleLogout,
  navigate,
  lang,
  t
}) => {
  return (
    <div className="side-menu-mobile">
      <div className="mobile-menu-items">
        <div 
          className={`mobile-menu-item ${activeMarket === 'crypto-futures' ? 'active' : ''}`}
          onClick={() => handleMarketClick('crypto-futures')}
        >
          {activeMarket === 'crypto-futures' ? <img src="/crypto-futures-active.svg" alt="Crypto Futures" /> : <img src="/crypto-futures.svg" alt="Crypto Futures" />}
          Crypto
        </div>
        <div 
          className={`mobile-menu-item ${activeMarket === 'forex' ? 'active' : ''}`}
          onClick={() => handleMarketClick('forex')}
        >
          {activeMarket === 'forex' ? <img src="/forex-active.svg" alt="Forex" /> : <img src="/forex.svg" alt="Forex" />}
          Forex
        </div>
        <div 
          className={`mobile-menu-item ${activeMarket === 'stock' ? 'active' : ''}`}
          onClick={() => handleMarketClick('stock')}
        >
          {activeMarket === 'stock' ? <img src="/stock-active.svg" alt="Stock" /> : <img src="/stock.svg" alt="Stock" />}
          Stock
        </div>
        <div 
          className="mobile-menu-item"
          onClick={() => setShowMobileUserDropdown(!showMobileUserDropdown)}
        >
          <FontAwesomeIcon icon={faUser} />
          {t('header.account')}
        </div>
        {showMobileUserDropdown && (
          <div className="user-dropdown" ref={userMobileDropdownRef}>
            <div className="dropdown-header">
              <button 
                className="close-dropdown" 
                onClick={() => setShowMobileUserDropdown(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="dropdown-section">
              <div className="dropdown-title">Language</div>
              <button 
                className={`dropdown-item ${selectedLanguage === 'vi' ? 'selected' : ''}`} 
                onClick={() => {
                  changeLanguage('vi');
                  setShowMobileUserDropdown(false);
                }}
              >
                Tiếng Việt
              </button>
              <button 
                className={`dropdown-item ${selectedLanguage === 'en' ? 'selected' : ''}`} 
                onClick={() => {
                  changeLanguage('en');
                  setShowMobileUserDropdown(false);
                }}
              >
                English
              </button>
              <button 
                className={`dropdown-item ${selectedLanguage === 'ja' ? 'selected' : ''}`} 
                onClick={() => {
                  changeLanguage('ja');
                  setShowMobileUserDropdown(false);
                }}
              >
                Japanese
              </button>
            </div>
            
            {currentUser ? (
              <div className="dropdown-section">
                <div className="dropdown-title">Account</div>
                <Link 
                  to={`/${lang}/change-password`} 
                  className="dropdown-item"
                  onClick={() => setShowMobileUserDropdown(false)}
                >
                  {t('header.changePassword')}
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowMobileUserDropdown(false);
                  }} 
                  className="dropdown-item"
                >
                  {t('header.logout')}
                </button>
                <Link 
                  to={`/${lang}/landing`} 
                  className="dropdown-item"
                  onClick={() => setShowMobileUserDropdown(false)}
                >
                  {t('homePage')}
                </Link>
              </div>
            ) : (
              ''
            )}
            
            <div style={{ flex: 1 }}></div>
            
            <div className="dropdown-section">
              {currentUser ? (
                <button 
                  className="upgrade-btn-fullscreen" 
                  onClick={() => {
                    handleUpgradeClick();
                    setShowMobileUserDropdown(false);
                  }}
                >
                  {t('analysis.upgradeTraiOS')}
                </button>
              ) : (
                <button 
                  className="signin-signup-btn" 
                  onClick={() => {
                    navigate(`/${lang}/login`);
                    setShowMobileUserDropdown(false);
                  }}
                >
                  {t('analysis.signInSignUp')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu; 