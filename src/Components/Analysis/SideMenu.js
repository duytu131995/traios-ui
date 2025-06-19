import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const SideMenu = ({
  lang,
  activeMarket,
  handleMarketClick,
  currentUser,
  userDropdownRef,
  showUserDropdown,
  setShowUserDropdown,
  handleLogout,
  languageDropdownRef,
  showLanguageDropdown,
  setShowLanguageDropdown,
  selectedLanguage,
  changeLanguage,
  t
}) => {
  return (
    <div className="side-menu">
      <div className="side-menu-logo">
        <Link to={`/${lang}/landing`}>
          <img src="/logo.svg" alt="TraiOS Logo" />
        </Link>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Market</div>
        <div
          className={`menu-item ${activeMarket === 'crypto-futures' ? 'active' : ''}`}
          onClick={() => handleMarketClick('crypto-futures')}
        >
          {activeMarket === 'crypto-futures' ? <img src="/crypto-futures-active.svg" alt="Crypto Futures" /> : <img src="/crypto-futures.svg" alt="Crypto Futures" />}
          Crypto
        </div>
        <div 
          className={`menu-item ${activeMarket === 'forex' ? 'active' : ''}`}
          onClick={() => handleMarketClick('forex')}
        >
          {activeMarket === 'forex' ? <img src="/forex-active.svg" alt="Forex" /> : <img src="/forex.svg" alt="Forex" />}
          Forex
        </div>
        <div 
          className={`menu-item ${activeMarket === 'stock' ? 'active' : ''}`}
          onClick={() => handleMarketClick('stock')}
        >
          {activeMarket === 'stock' ? <img src="/stock-active.svg" alt="Stock" /> : <img src="/stock.svg" alt="Stock" />}
          Stock
        </div>
      </div>

      <div style={{ flex: 1 }}></div>

      {currentUser ? (
        <div className="others-section">
          <div className="user-menu-container" ref={userDropdownRef}>
            <div 
              className="menu-item"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <FontAwesomeIcon icon={faUser} />
              {t('header.account')}
            </div>
            
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-section">
                  <div className="dropdown-section">
                    <Link 
                      to={`/${lang}/change-password`} 
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      {t('header.changePassword')}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowUserDropdown(false);
                      }} 
                      className="dropdown-item"
                    >
                      {t('header.logout')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="language-menu-container" ref={languageDropdownRef}>
            <div className="menu-item" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              <img src="/language.svg" alt="en flag" />
              {t('language')}
            </div>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <button
                  className={`dropdown-item ${selectedLanguage === 'en' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  {t('languages.english')}
                  {selectedLanguage === 'en' && <span className="check-icon">✓</span>}
                </button>
                <button
                  className={`dropdown-item ${selectedLanguage === 'vi' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('vi')}
                >
                  {t('languages.vietnamese')}
                  {selectedLanguage === 'vi' && <span className="check-icon">✓</span>}
                </button>
                <button
                  className={`dropdown-item ${selectedLanguage === 'ja' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('ja')}
                >
                  {t('languages.japanese')}
                  {selectedLanguage === 'ja' && <span className="check-icon">✓</span>}
                </button>
              </div>
            )}
          </div>
          <Link to={`/${lang}/landing`} className="menu-item">
            <img src="/about-us.svg" alt="About us" />
            About us
          </Link>
          <hr />
          <div className="copyright">
            Copyright © 2025 TraiOS. All rights reserved. <br/><br/>
            Built with Bolt.new.
          </div>
        </div>
      ) : (
        <div className="others-section">
          <div className="menu-section-title">Others</div>
          <div className="language-menu-container" ref={languageDropdownRef}>
            <div className="menu-item" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              <img src="/language.svg" alt="en flag" />
              {t('language')}
            </div>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <button
                  className={`dropdown-item ${selectedLanguage === 'en' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  {t('languages.english')}
                  {selectedLanguage === 'en' && <span className="check-icon">✓</span>}
                </button>
                <button
                  className={`dropdown-item ${selectedLanguage === 'vi' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('vi')}
                >
                  {t('languages.vietnamese')}
                  {selectedLanguage === 'vi' && <span className="check-icon">✓</span>}
                </button>
                <button
                  className={`dropdown-item ${selectedLanguage === 'ja' ? 'selected' : ''}`}
                  onClick={() => changeLanguage('ja')}
                >
                  {t('languages.japanese')}
                  {selectedLanguage === 'ja' && <span className="check-icon">✓</span>}
                </button>
              </div>
            )}
          </div>
          <Link to={`/${lang}/landing`} className="menu-item">
            <img src="/about-us.svg" alt="About us" />
            About us
          </Link>
          <hr />
          <div className="copyright">
            Copyright © 2025 TraiOS. All rights reserved. <br/><br/>
            Built with Bolt.new.
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu; 