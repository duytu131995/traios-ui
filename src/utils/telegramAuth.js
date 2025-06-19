/**
 * Tiện ích xác thực Telegram
 * 
 * Tệp này chứa các hàm tiện ích để làm việc với xác thực Telegram
 */

// Hàm tạo widget Telegram Login
export const createTelegramLoginWidget = (
  botName,
  containerId,
  callbackName,
  requestAccess = 'write',
  size = 'large'
) => {
  console.log("== Hàm tạo widget Telegram Login")
  // Xóa widget cũ nếu có
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
  console.log(container)
  // Tạo script element
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', botName);
  script.setAttribute('data-size', size);
  script.setAttribute('data-request-access', requestAccess);
  script.setAttribute('data-userpic', 'false');
  script.setAttribute('data-onauth', callbackName + '(user)');
  script.setAttribute('data-radius', '8');

  // Thêm script vào container
  container.appendChild(script);
};

// Hàm xác thực dữ liệu từ Telegram
export const validateTelegramAuth = (authData) => {
  console.log("validateTelegramAuth: ", authData)
  if (!authData) return false;

  const {
    id,
    first_name,
    last_name,
    username,
    photo_url,
    auth_date,
    hash
  } = authData;

  // Kiểm tra các trường bắt buộc
  if (!id || !first_name || !auth_date || !hash) {
    return false;
  }

  // Kiểm tra thời gian xác thực (không quá 24 giờ)
  const authDate = new Date(auth_date * 1000);
  const now = new Date();
  const diffHours = Math.abs(now - authDate) / 36e5;
  if (diffHours > 24) {
    return false;
  }

  return true;
};

// Hàm format dữ liệu Telegram để gửi đến API
export const formatTelegramCredential = (telegramUser) => {
  return {
    id: telegramUser.id,
    first_name: telegramUser.first_name,
    last_name: telegramUser.last_name || '',
    // username: telegramUser.username || '',
    // photo_url: telegramUser.photo_url || '',
    auth_date: telegramUser.auth_date,
    hash: telegramUser.hash
  };
};

export default {
  createTelegramLoginWidget,
  validateTelegramAuth,
  formatTelegramCredential
}; 