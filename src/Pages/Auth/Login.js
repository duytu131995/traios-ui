import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { createTelegramLoginWidget, validateTelegramAuth, formatTelegramCredential } from '../../utils/telegramAuth';
import { useTranslation } from 'react-i18next';
import { TwitterAuthProvider, FacebookAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import axiosInstance from '../../config/axios';
import TelegramLoginPopup from '../../Components/Auth/TelegramLoginPopup';

const TELEGRAM_BOT_NAME = 'tradereasoningai_bot';
// const TELEGRAM_BOT_NAME = 'Local8686Bot';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const { loginWithApi, loginWithGoogle, loginWithFacebook, loginWithTwitter, loginWithTelegram, error, setError, loginError } = useAuth();
  const navigate = useNavigate();
  const telegramButtonRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);

  // Đảm bảo ngôn ngữ được đồng bộ từ URL parameter
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  }, [lang, i18n]);

  // Cập nhật loginErrorMessage khi loginError thay đổi
  useEffect(() => {
    if (loginError) {
      setLoginErrorMessage(loginError);
    }
  }, [loginError]);

  // Xóa thông báo lỗi chỉ khi người dùng bắt đầu nhập
  const handleInputChange = (e, setter) => {
    // setLoginErrorMessage('');
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Xử lý đăng nhập với email/password
      const success = await loginWithApi(email, password);
      
      if (success) {
        // Redirect to analysis page on successful login
        const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
        navigate(`/${currentLang}/analysis`);
      } else {
        // Hiển thị lỗi nếu đăng nhập thất bại
        setError(loginError || 'Wrong email or password.');
      }
    } catch (err) {
      console.log("Login error:", err);
      setError('Something went wrong during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Google thông qua Firebase
  async function handleFirebaseGoogleLogin() {
    try {
      setError('');
      setLoginErrorMessage('');
      setLoading(true);
      
      // Sử dụng đăng nhập Google qua Firebase
      const user = await loginWithGoogle();
      if (user) {
        const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
        window.location.href = `/${currentLang}/analysis`;
      }
    } catch (error) {
      console.error('Lỗi đăng nhập Google Firebase:', error);
      // Không cần hiển thị lỗi ở đây nếu đã được xử lý trong context
      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Lỗi đăng nhập Google: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Facebook thông qua Firebase
  async function handleFirebaseFacebookLogin() {
    try {
      setError('');
      setLoginErrorMessage('');
      setLoading(true);
      
      // Gọi API đăng nhập với token từ Firebase
      const user = await loginWithFacebook();
      
      if (user) {
        const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
        window.location.href = `/${currentLang}/analysis`;
      }
    } catch (error) {
      console.error('Lỗi đăng nhập Facebook Firebase:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTwitterLogin() {
    try {
      setError('');
      setLoginErrorMessage('');
      setLoading(true);
      
      // Gọi API đăng nhập với token từ Firebase
      const user = await loginWithTwitter();
      
      if (user) {
        const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
        window.location.href = `/${currentLang}/analysis`;
      }
    } catch (error) {
      console.error('Lỗi đăng nhập Twitter:', error);
      
      // Xử lý các trường hợp lỗi cụ thể
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Đăng nhập đã bị hủy. Vui lòng thử lại.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('Tài khoản đã tồn tại với phương thức đăng nhập khác.');
      } else {
        setError('Lỗi đăng nhập Twitter: ' + (error.message || 'Vui lòng thử lại sau'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTelegramLoginCallback(telegramUser) {
    try {
      setError('');
      setLoginErrorMessage('');
      setLoading(true);
      
      // Format dữ liệu Telegram để gửi đến API -> Không cần format gửi cả lên cho BE
      // const credential = formatTelegramCredential(telegramUser);
      // console.log("Thông tin Telegram:", credential);
      
      // Gọi API đăng nhập Telegram
      const result = await loginWithTelegram(telegramUser);
      console.log("Kết quả đăng nhập Telegram:", result);
      
      // Chuyển hướng sau khi đăng nhập thành công
      if (result) {
        const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
        window.location.href = `/${currentLang}/analysis`;
      }
    } catch (error) {
      console.error('Lỗi đăng nhập Telegram:', error);
      setError('Đăng nhập Telegram thất bại: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  }

  // Hàm này được sử dụng khi nút dự phòng Telegram được nhấn
  function handleManualTelegramLogin() {
    setShowTelegramPopup(true);
  }

  // Handler xử lý khi widget Telegram gọi callback
  function handleTelegramAuth(user) {
    console.log("Telegram auth callback received:", user);
    
    if (validateTelegramAuth(user)) {
      handleTelegramLoginCallback(user);
    } else {
      setError('Dữ liệu xác thực Telegram không hợp lệ hoặc đã hết hạn');
    }
  }

  // Đóng popup
  function handleCloseTelegramPopup() {
    setShowTelegramPopup(false);
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  // Language change handler
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // Cập nhật URL với ngôn ngữ mới
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/').filter(part => part);
    
    if (parts.length > 0) {
      // Thay thế phần ngôn ngữ trong URL
      parts[0] = lang;
      const newPath = `/${parts.join('/')}`;
      navigate(newPath);
    } else {
      navigate(`/${lang}/login`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Link to={`/${i18n.language}/landing`}>
            <img src="/logo.svg" alt="TraiOS Logo" />
          </Link>
        </div>
        
        <h2>{t('login.signIn')}</h2>
        
        {/* error && <div className="login-error">{error}</div> */}
        
        <form onSubmit={handleLogin}>
          <div className={`form-group ${loginErrorMessage ? 'has-error' : ''}`}>
            <label htmlFor="email">{t('login.email')}</label>
            <input
              type="email"
              id="email"
              placeholder={t('enterYourEmail')}
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              required
            />
            {loginErrorMessage && (
              <div className="login-error-message">{loginErrorMessage}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t('enterYourPassword')}
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                required
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                onMouseDown={(e) => e.preventDefault()}
              >
                <img 
                  src={showPassword ? "/end-content.svg" : "/vector.svg"} 
                  alt={showPassword ? t('hidePassword') : t('showPassword')} 
                  className="toggle-password-icon"
                />
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-btn primary-btn" disabled={loading}>
            {t('login.next')}
          </button>
        </form>
        
        <div className="login-links">
          <Link to={`/${i18n.language}/register`} className="create-account">{t('login.createAccount')}</Link>
          <Link to={`/${i18n.language}/forgot-password`} className="forgot-password">{t('login.forgotPassword')}</Link>
        </div>
        
        <div className="login-divider">
          <span>{t('login.orContinueWith')}</span>
        </div>
        
        <div className="social-login-grid">
          <button 
            className="social-btn google-btn" 
            onClick={handleFirebaseGoogleLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
            <span>Google</span>
          </button>
          
          <button 
            className="social-btn facebook-btn" 
            onClick={handleFirebaseFacebookLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" />
            <span>Facebook</span>
          </button>
          
          <button 
            className="social-btn twitter-btn" 
            onClick={handleTwitterLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="Twitter" />
            <span>Twitter</span>
          </button>
          
          <button 
            className="social-btn telegram-btn" 
            onClick={handleManualTelegramLogin}
            disabled={loading}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111644.png" alt="Telegram" />
            <span>Telegram</span>
          </button>
        </div>
        
        {/* Thêm Telegram Popup */}
        <TelegramLoginPopup 
          isOpen={showTelegramPopup}
          onClose={handleCloseTelegramPopup}
          botName={TELEGRAM_BOT_NAME}
          onAuth={handleTelegramAuth}
        />

      </div>
    </div>
  );
}

export default Login; 