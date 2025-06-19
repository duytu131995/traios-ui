import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Auth.css';
import { TwitterAuthProvider, FacebookAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

function Register() {
  const { t, i18n } = useTranslation();
  const { lang = 'en' } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState('');
  const { registerWithApi, loginWithGoogle, loginWithFacebook, loginWithTwitter, loginWithTelegram } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      setRegisterErrorMessage(t('register.errors.emptyFields', 'Please enter your email and password'));
      return;
    }
    
    try {
      setRegisterErrorMessage('');
      setLoading(true);
      
      await registerWithApi(email, password);
      navigate(`/${lang}/verify-email`, { state: { email } });
    } catch (error) {
      console.error(t('register.errors.logPrefix', 'Registration error:'), error);
      if (!error.response) {
        setRegisterErrorMessage(t('register.errors.serverConnection', 'Cannot connect to server. Please try again later.'));
      } else {
        setRegisterErrorMessage(error.response.data?.message || t('register.errors.genericFail', 'Registration failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  async function handleTwitterLogin() {
    try {
      setRegisterErrorMessage('');
      setLoading(true);
      
      // Lấy instance của Firebase Auth
      const auth = getAuth();
      const provider = new TwitterAuthProvider();
      
      // Thực hiện đăng nhập bằng Twitter qua Firebase
      const result = await signInWithPopup(auth, provider);
      
      // Lấy credential từ kết quả
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;
      
      // Gọi API đăng nhập với token từ Firebase
      const user = await loginWithTwitter(token, secret);
      
      if (user) {
        navigate(`/${lang}/landing`);
      }
    } catch (error) {
      console.error(t('register.errors.twitterLogin', 'Twitter login error:'), error);
      
      // Xử lý các trường hợp lỗi cụ thể
      if (error.code === 'auth/popup-closed-by-user') {
        setRegisterErrorMessage(t('register.errors.loginCancelled', 'Login was cancelled. Please try again.'));
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setRegisterErrorMessage(t('register.errors.accountExists', 'Account already exists with a different login method.'));
      } else {
        setRegisterErrorMessage(t('register.errors.twitterLoginFailed', 'Twitter login error: ') + (error.message || t('register.errors.tryAgainLater', 'Please try again later')));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFacebookLogin() {
    try {
      setRegisterErrorMessage('');
      setLoading(true);
      
      // Lấy instance của Firebase Auth
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      
      // Thực hiện đăng nhập bằng Facebook qua Firebase
      const result = await signInWithPopup(auth, provider);
      
      // Lấy credential từ kết quả
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      
      // Gọi API đăng nhập với token từ Firebase
      const user = await loginWithFacebook(accessToken);
      
      if (user) {
        navigate(`/${lang}/landing`);
      }
    } catch (error) {
      console.error(t('register.errors.facebookLogin', 'Facebook login error:'), error);
      
      // Xử lý các trường hợp lỗi cụ thể
      if (error.code === 'auth/popup-closed-by-user') {
        setRegisterErrorMessage(t('register.errors.loginCancelled', 'Login was cancelled. Please try again.'));
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setRegisterErrorMessage(t('register.errors.accountExists', 'Account already exists with a different login method.'));
      } else {
        setRegisterErrorMessage(t('register.errors.facebookLoginFailed', 'Facebook login error: ') + (error.message || t('register.errors.tryAgainLater', 'Please try again later')));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Link to={`/${lang}/landing`}>
            <img src="/logo.svg" alt={t('register.logoAlt', 'TraiOS Logo')} />
          </Link>
        </div>
        
        <h2>{t('register.title', 'Create your TraiOS account')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${registerErrorMessage ? 'has-error' : ''}`}>
            <label htmlFor="email">{t('register.emailLabel', 'Email')}</label>
            <input
              type="email"
              id="email"
              placeholder={t('register.emailPlaceholder', 'Enter your email')}
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              required
            />
            {registerErrorMessage && (
              <div className="login-error-message">{registerErrorMessage}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('register.passwordLabel', 'Password')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t('register.passwordPlaceholder', 'Enter your password')}
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                required
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')}
                onMouseDown={(e) => e.preventDefault()}
              >
                <img 
                  src={showPassword ? "/end-content.svg" : "/vector.svg"} 
                  alt={showPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')} 
                  className="toggle-password-icon"
                />
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-btn primary-btn" disabled={loading}>
            {t('register.submitButton', 'Next')}
          </button>
        </form>
        
        <div className="login-links">
          <Link to={`/${lang}/login`} className="create-account">{t('register.signInLink', 'Already have account? Sign in now')}</Link>
        </div>
        
        <div className="login-divider">
          <span>{t('register.orContinueWith', 'or continue with')}</span>
        </div>
        
        <div className="social-login-grid">
          <button 
            className="social-btn google-btn" 
            onClick={() => loginWithGoogle()}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
            <span>{t('register.socialButtons.google', 'Google')}</span>
          </button>
          
          <button 
            className="social-btn facebook-btn" 
            onClick={handleFacebookLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" />
            <span>{t('register.socialButtons.facebook', 'Facebook')}</span>
          </button>
          
          <button 
            className="social-btn twitter-btn" 
            onClick={handleTwitterLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="Twitter" />
            <span>{t('register.socialButtons.twitter', 'Twitter')}</span>
          </button>
          
          <button 
            className="social-btn telegram-btn" 
            onClick={() => loginWithTelegram()}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111644.png" alt="Telegram" />
            <span>{t('register.socialButtons.telegram', 'Telegram')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register; 