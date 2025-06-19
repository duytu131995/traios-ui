import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LandingPage.css';
import MobileLanding from './MobileLanding';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguageOptions, setShowMobileLanguageOptions] = useState(false);
  const [showMobileAccountOptions, setShowMobileAccountOptions] = useState(false);
  
  const languageDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLanguageOptionsRef = useRef(null);
  const mobileAccountOptionsRef = useRef(null);

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
      if (mobileLanguageOptionsRef.current && 
          !mobileLanguageOptionsRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-section-title.language')) {
        setShowMobileLanguageOptions(false);
      }
      if (mobileAccountOptionsRef.current && 
          !mobileAccountOptionsRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-section-title.account')) {
        setShowMobileAccountOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageDropdownRef, userDropdownRef, mobileMenuRef, mobileLanguageOptionsRef, mobileAccountOptionsRef]);

  // Cập nhật ngôn ngữ
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    setShowMobileLanguageOptions(false);
    setShowMobileMenu(false);
    
    // Cập nhật URL với ngôn ngữ mới
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      pathParts[1] = language;
      navigate(pathParts.join('/'));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowMobileMenu(false);
      navigate(`/${lang}/login`);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Hàm kiểm tra URL hiện tại đơn giản
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="landing-header">
        <div className="header-left">
          <Link to={`/${lang}/landing`} className="logo-container">
            <img src="/logo.svg" alt="TraiOS Logo" />
          </Link>
          
          <nav className="main-nav">
            <ul>
              <li>
                <Link 
                  to={`/${lang}/analysis`} 
                  className={isActive('/analysis') ? 'active' : ''}
                >
                  {t('header.analysis')}
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${lang}/pricing`} 
                  className={isActive('/pricing') ? 'active' : ''}
                >
                  {t('header.pricing')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="header-right">
          {currentUser ? (
            <>
              <Link to={`/${lang}/pricing`} className="upgrade-btn">
                {t('header.upgradeTraiOS')}
              </Link>
            </>
          ) : ''}

          <div className="language-menu-container" ref={languageDropdownRef}>
            <div className="language-selector" onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              <img src="/language.svg" alt={`${selectedLanguage} flag`} />
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

          {currentUser ? (
            <div className="user-menu-container" ref={userDropdownRef}>
              <div 
                className="user-avatar"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <img src="/user.svg" alt="User Avatar" />
              </div>
              
              {showUserDropdown && (
                <div className="user-dropdown">
                  <Link to={`/${lang}/change-password`} className="dropdown-item">
                    {t('header.changePassword')}
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    {t('header.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={`/${lang}/login`} className="sign-in-btn">
                {t('header.signInSignUp')}
              </Link>
            </>
          )}
          
        </div>
      </header>

      {/* Mobile Header */}
      <MobileLanding
        lang={lang}
        showMobileMenu={showMobileMenu}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuRef={mobileMenuRef}
        isActive={isActive}
        t={t}
        currentUser={currentUser}
        handleLogout={handleLogout}
        showMobileLanguageOptions={showMobileLanguageOptions}
        setShowMobileLanguageOptions={setShowMobileLanguageOptions}
        mobileLanguageOptionsRef={mobileLanguageOptionsRef}
        changeLanguage={changeLanguage}
        selectedLanguage={selectedLanguage}
        showMobileAccountOptions={showMobileAccountOptions}
        setShowMobileAccountOptions={setShowMobileAccountOptions}
        mobileAccountOptionsRef={mobileAccountOptionsRef}
        setShowMobileMenu={setShowMobileMenu}
      />
    </>
  );
};

export default Header; 