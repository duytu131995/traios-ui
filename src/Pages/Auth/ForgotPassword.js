import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('forgotPassword.errors.emailRequired', 'Please enter your email'));
      return;
    }
    // Tạm thời log ra email
    console.log('Reset password requested for:', email);
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ height: 'auto' }}>
        <div className="login-logo">
          <Link to={`/${lang}/landing`}>
            <img src="/logo.svg" alt={t('forgotPassword.logoAlt', 'TraiOS Logo')} />
          </Link>
        </div>
        
        <h2>{t('forgotPassword.title', 'Enter your email')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${error ? 'has-error' : ''}`}>
            <label>{t('forgotPassword.emailLabel', 'Email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder={t('forgotPassword.emailPlaceholder', 'Enter your email')}
            />
            {error && <div className="login-error-message">{error}</div>}
          </div>

          <button type="submit" className="login-btn">
            {t('forgotPassword.submitButton', 'Next')}
          </button>
        </form>
        
        <div className="login-links">
          <Link to={`/${lang}/login`} className="create-account">
            {t('forgotPassword.backToLogin', 'Back to login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 