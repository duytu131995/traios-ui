import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/Auth.css';

function PasswordUpdated() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang = 'en' } = useParams();

  // Đảm bảo ngôn ngữ được tải đúng
  useEffect(() => {
    if (lang && ['en', 'vi', 'ja'].includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const handleBackHome = () => {
    navigate(`/${lang}/analysis`);
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-logo">
          <Link to={`/${lang}/landing`}>
            <img src="/logo.svg" alt={t('passwordUpdated.logoAlt', 'TraiOS Logo')} />
          </Link>
        </div>
        
        <h2>{t('passwordUpdated.title', 'Password Updated')}</h2>
        
        <div className="verify-message">
          <p>{t('passwordUpdated.message', 'Your password has been set successfully')}</p>
        </div>
        
        <div className="verify-action" style={{ marginTop: '32px' }}>
          <button 
            onClick={handleBackHome} 
            className="login-btn primary-btn"
          >
            {t('passwordUpdated.backHomeButton', 'Back Home')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordUpdated; 