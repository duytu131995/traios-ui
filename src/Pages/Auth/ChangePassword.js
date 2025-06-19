import React, { useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Auth.css';
import '../../styles/ChangePassword.css';

function ChangePassword() {
  const { t, i18n } = useTranslation();
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const { lang = 'en' } = useParams();
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate old password
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = t('changePassword.errors.passwordRequired', 'Password is required');
      isValid = false;
    }
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('changePassword.errors.passwordRequired', 'Password is required');
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t('changePassword.errors.passwordTooShort', 'Password must be at least 8 characters');
      isValid = false;
    }
    
    // Validate confirm password
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.errors.passwordsDoNotMatch', 'Passwords do not match');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError('');
      setLoading(true);
      
      await changePassword(formData.oldPassword, formData.newPassword);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/${lang}/password-updated`);
      }, 1000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || t('changePassword.errors.genericError', 'Error changing password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="auth-logo">
          <Link to={`/${lang}/landing`}>
            <img src="/logo.svg" alt={t('changePassword.logoAlt', 'TraiOS Logo')} />
          </Link>
        </div>
        
        <h1>{t('changePassword.title', 'Change Password')}</h1>
        
        {success && (
          <div className="success-message">
            {t('changePassword.successMessage', 'Password changed successfully')}
          </div>
        )}
        
        {error && (
          <div className="error-message auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">{t('changePassword.oldPasswordLabel', 'Old Password')}</label>
            <div className="password-input-container">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={errors.oldPassword ? 'error' : ''}
                disabled={loading}
                placeholder={t('changePassword.oldPasswordPlaceholder', 'Enter your old password')}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('old')}
                aria-label={showOldPassword ? t('changePassword.hidePassword', 'Hide password') : t('changePassword.showPassword', 'Show password')}
              >
                <i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.oldPassword && <div className="error-message">{errors.oldPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">{t('changePassword.newPasswordLabel', 'New Password')}</label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? 'error' : ''}
                disabled={loading}
                placeholder={t('changePassword.newPasswordPlaceholder', 'Enter your new password')}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showNewPassword ? t('changePassword.hidePassword', 'Hide password') : t('changePassword.showPassword', 'Show password')}
              >
                <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('changePassword.confirmPasswordLabel', 'Confirm Password')}</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
                placeholder={t('changePassword.confirmPasswordPlaceholder', 'Confirm your new password')}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showConfirmPassword ? t('changePassword.hidePassword', 'Hide password') : t('changePassword.showPassword', 'Show password')}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : t('changePassword.submitButton', 'Update Password')}
          </button>
        </form>
        
        <div className="back-link">
          <Link to={`/${lang}/landing`}>
            <i className="fas fa-arrow-left"></i> {t('changePassword.backToHome', 'Back to home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword; 