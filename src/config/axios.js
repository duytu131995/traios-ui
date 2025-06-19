import axios from 'axios';
import { toast } from 'react-toastify'; // Thêm toast để hiển thị thông báo
import i18next from 'i18next'; // Import i18next để lấy bản dịch
// Thêm biến BASE_URL để cấu hình
const BASE_URL = 'https://cicada-poetic-narwhal.ngrok-free.app';

// Cấu hình axios với URL ngrok
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Tăng timeout lên để giảm thiểu lỗi timeout
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Thêm interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Biến để kiểm soát việc refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý hàng đợi các request đã thất bại
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Không xử lý cho request login, register hoặc refresh token
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/register') || 
          originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Không có refresh token, đăng xuất người dùng
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
          isRefreshing = false;
          return Promise.reject(error);
        }
        
        try {
          // Gọi API để lấy token mới từ refresh token
          const response = await axios.post(`${BASE_URL}/auth/refresh`, null, {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
              'Accept': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          
          if (response?.data?.access_token) {
            const newToken = response.data.access_token;
            // Lưu token mới vào localStorage
            localStorage.setItem('authToken', newToken);
            
            // Lưu refresh token mới (nếu server trả về)
            // if (response?.data?.refresh_token) {
            //   localStorage.setItem('refreshToken', response.data.refresh_token);
            // }
            
            // Cập nhật header Authorization cho request hiện tại
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Xử lý hàng đợi các request đã bị reject
            processQueue(null, newToken);
            
            // Thực hiện lại request ban đầu với token mới
            return axiosInstance(originalRequest);
          } else {
            processQueue(new Error('Không nhận được token mới'));
            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError);
          
          // Kiểm tra xem lỗi refresh token có phải do token hết hạn/không hợp lệ hay không
          if (refreshError.response && 
             (refreshError.response.status === 401 || refreshError.response.status === 403)) {
            // Refresh token hết hạn hoặc không hợp lệ, yêu cầu đăng nhập lại
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            delete axiosInstance.defaults.headers.common['Authorization'];
            
            // Hiển thị thông báo cho người dùng
            const message = i18next.t('auth.errors.token.refreshExpired', 
                                     'Your session has expired, please login again');
            toast.error(message, {
              position: "top-right",
              autoClose: 5000
            });
            
            // Lấy ngôn ngữ hiện tại từ localStorage nếu có
            const currentLang = localStorage.getItem('preferredLanguage') || 'en';
            
            // Chuyển hướng đến trang đăng nhập
            window.location.href = `/${currentLang}/login`;
          } else {
            // Lỗi khác, xóa token nhưng không điều hướng
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            delete axiosInstance.defaults.headers.common['Authorization'];
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Nếu đang refresh token, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 