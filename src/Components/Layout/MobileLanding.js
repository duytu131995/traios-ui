import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MobileLanding = ({
  lang,
  showMobileMenu,
  toggleMobileMenu,
  mobileMenuRef,
  isActive,
  t,
  currentUser,
  handleLogout,
  showMobileLanguageOptions,
  setShowMobileLanguageOptions,
  mobileLanguageOptionsRef,
  changeLanguage,
  selectedLanguage,
  showMobileAccountOptions,
  setShowMobileAccountOptions,
  mobileAccountOptionsRef,
  setShowMobileMenu
}) => {
  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <Link to={`/${lang}/landing`} className="mobile-logo">
          <img src="/logo.svg" alt="TraiOS Logo" />
        </Link>
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu" ref={mobileMenuRef}>
          <div className="mobile-menu-header">
            <Link to={`/${lang}/landing`} className="mobile-logo">
              <img src="/logo.svg" alt="TraiOS Logo" />
            </Link>
            <button className="mobile-menu-close" onClick={() => setShowMobileMenu(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#11181C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="#11181C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <nav className="mobile-menu-nav">
            <ul>
              <li>
                <Link 
                  to={`/${lang}/analysis`} 
                  onClick={() => setShowMobileMenu(false)}
                  className={isActive('/analysis') ? 'active' : ''}
                >
                  {t('header.analysis')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="mobile-menu-nav">
            <ul>
              <li>
                <Link 
                  to={`/${lang}/pricing`} 
                  onClick={() => setShowMobileMenu(false)}
                  className={isActive('/pricing') ? 'active' : ''}
                >
                  {t('header.pricing')}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mobile-menu-languages">
            <p className={`mobile-menu-section-title language ${showMobileLanguageOptions ? 'active' : ''}`} onClick={() => setShowMobileLanguageOptions(!showMobileLanguageOptions)}>
              {t('header.language', 'Language')}
            </p>
            {showMobileLanguageOptions && (
              <div className="mobile-language-options" ref={mobileLanguageOptionsRef}>
                <button 
                  className="mobile-language-option"
                  onClick={() => changeLanguage('vi')}
                >
                  <span>{t('languages.vietnamese')}</span>
                  {selectedLanguage === 'vi' && <span className="check-icon">✓</span>}
                </button>
                <button 
                  className="mobile-language-option"
                  onClick={() => changeLanguage('en')}
                >
                  <span>{t('languages.english')}</span>
                  {selectedLanguage === 'en' && <span className="check-icon">✓</span>}
                </button>
                <button 
                  className="mobile-language-option"
                  onClick={() => changeLanguage('ja')}
                >
                  <span>{t('languages.japanese')}</span>
                  {selectedLanguage === 'ja' && <span className="check-icon">✓</span>}
                </button>
              </div>
            )}
          </div>
          
          {currentUser && (
            <div className="mobile-menu-account">
              <p className={`mobile-menu-section-title account ${showMobileAccountOptions ? 'active' : ''}`} onClick={() => setShowMobileAccountOptions(!showMobileAccountOptions)}>
                {t('header.account', 'Account')}
              </p>
              {showMobileAccountOptions && (
                <div className="mobile-account-options" ref={mobileAccountOptionsRef}>
                  <Link 
                    to={`/${lang}/change-password`} 
                    className="mobile-account-option"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('header.changePassword', 'Change password')}
                  </Link>
                  <button 
                    className="mobile-account-logout" 
                    onClick={handleLogout}
                  >
                    {t('header.logout', 'Sign out')}
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="mobile-menu-actions">
            {currentUser ? (
              <Link 
                to={`/${lang}/pricing`} 
                className="mobile-menu-upgrade"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('header.upgradeTraiOS', 'Upgrade TraiOS')}
              </Link>
            ) : (
              <Link 
                to={`/${lang}/login`} 
                className="mobile-menu-signin"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('header.signInSignUp')}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileLanding; 