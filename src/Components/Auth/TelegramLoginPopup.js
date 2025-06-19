import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/TelegramPopup.css'; // Tạo file CSS cho popup

const TelegramLoginPopup = ({ isOpen, onClose, botName, onAuth }) => {
  const { t } = useTranslation();
  const telegramButtonRef = useRef(null);
  
  useEffect(() => {
    // Khởi tạo widget Telegram khi popup mở
    if (isOpen && telegramButtonRef.current) {
      // Xóa nội dung cũ nếu có
      telegramButtonRef.current.innerHTML = '';
      
      // Tạo script widget Telegram
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      
      // Thêm vào container
      telegramButtonRef.current.appendChild(script);
      
      // Đặt callback toàn cục để widget có thể gọi
      window.onTelegramAuth = function(user) {
        if (onAuth) {
          onAuth(user);
          onClose(); // Đóng popup sau khi xác thực thành công
        }
      };
    }
    
    return () => {
      // Cleanup khi component unmount
      if (isOpen) {
        delete window.onTelegramAuth;
      }
    };
  }, [isOpen, botName, onAuth, onClose]);
  
  // Không render gì nếu popup không mở
  if (!isOpen) return null;
  
  return (
    <div className="telegram-popup-overlay">
      <div className="telegram-popup-container">
        <div className="telegram-popup-header">
          <h3>{t('auth.telegramLogin.title')}</h3>
          <button className="telegram-popup-close" onClick={onClose}>×</button>
        </div>
        <div className="telegram-popup-content">
          <p>{t('auth.telegramLogin.description')}</p>
          <div ref={telegramButtonRef} className="telegram-button-container"></div>
        </div>
        <div className="telegram-popup-footer">
          <button className="telegram-popup-cancel" onClick={onClose}>{t('auth.telegramLogin.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default TelegramLoginPopup;