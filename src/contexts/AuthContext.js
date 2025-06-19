import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, twitterProvider, telegramProvider } from '../config/firebase';
import axiosInstance from '../config/axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Thêm biến BASE_URL để cấu hình
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'; // Thay đổi URL mặc định nếu cần

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { i18n } = useTranslation();

  // Đăng nhập bằng API thông thường
  const loginWithApi = async (email, password) => {
    try {
      const url = '/auth/login';
      const response = await axiosInstance.post(url, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const { access_token: token, refresh_token: refreshToken } = response.data;
      const { email: user } = response.data.user;

      // Gom nhóm các thao tác cập nhật state lại với nhau
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Cập nhật state trong một batch
      setIsAuthenticated(true);
      setCurrentUser(user);
      setError(null);
      setLoginError(null);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Incorrect email or password';
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.message === 'CREDENTIAL_INVALID') {
          errorMessage = 'Incorrect email or password';
        } else {
          errorMessage = errorData.message;
        }
      }
      
      // Cập nhật state lỗi trong một batch
      setLoginError(errorMessage);
      setIsAuthenticated(false);
      setCurrentUser(null);
      return false;
    }
  };

  // Đăng nhập với Telegram
  async function loginWithTelegram(telegramData) {
    try {
      setError('');
      setLoginError('');
      
      // Gọi API đăng nhập với dữ liệu Telegram
      const response = await axiosInstance.post('/auth/telegram/login', {
          credential: telegramData
        });
      
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        
        const user = response.data.user;
        setCurrentUser(user);
        setLoginError(null);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Lỗi đăng nhập Telegram:', error);
      setLoginError(error.response?.data?.message || 'Lỗi đăng nhập Telegram');
      return null;
    }
  }

  // Đăng nhập với Google thông qua Firebase
  async function loginWithGoogle() {
    try {
      setError('');
      // const result = await signInWithPopup(auth, googleProvider);
      
      // // Lấy token ID từ kết quả
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const idToken = credential.idToken;

      const signInWithGoogle = () => {
        return new Promise((resolve, reject) => {
          signInWithPopup(auth, googleProvider)
            .then(async (result) => {
              const idToken = result._tokenResponse.idToken;
              console.log("Token đã được lưu:", idToken);

              try {
                // Gọi API đăng nhập với token ID từ Firebase
                const response = await axiosInstance.post('/auth/firebase/login', {
                  credential: idToken
                });
                
                console.log("Đăng nhập thành công:", response.data);
                
                // Lấy thông tin user từ response API hoặc từ result Google
                const user = response.data.user || result.user;
                
                // Lưu token nếu API trả về
                if (response.data.token) {
                  localStorage.setItem('authToken', response.data.token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                } else if (response.data.access_token) {
                  localStorage.setItem('authToken', response.data.access_token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                }
                
                // Resolve Promise với user
                resolve(user);
                
              } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                reject(error);
              }
            })
            .catch((error) => {
              console.error("Lỗi đăng nhập với Google:", error);
              reject(error);
            });
        });
      };

      // Sử dụng hàm này
      try {
        const user = await signInWithGoogle();
        setCurrentUser(user);
        setLoginError(null);
        return user;
      } catch (error) {
        setLoginError(error.message);
        return null;
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Đăng nhập Google bị hủy bởi người dùng');
        setError('Đăng nhập đã bị hủy. Vui lòng thử lại.');
      } else {
        console.error('Lỗi đăng nhập Google:', error);
        setError('Đăng nhập Google thất bại: ' + error.message);
      }
      throw error;
    }
  }

  // Đăng nhập với Facebook thông qua Firebase
  async function loginWithFacebook(accessToken) {
    try {
      setError('');
      const signInWithFacebook = () => {
        return new Promise((resolve, reject) => {
          signInWithPopup(auth, facebookProvider)
            .then(async (result) => {
              const idToken = result._tokenResponse.idToken;
              console.log("Token đã được lưu:", idToken);

              try {
                // Gọi API đăng nhập với token ID từ Firebase
                const response = await axiosInstance.post('/auth/firebase/login', {
                  credential: idToken
                });
                
                console.log("Đăng nhập thành công:", response.data);
                
                // Lấy thông tin user từ response API hoặc từ result Facebook
                const user = response.data.user || result.user;
                
                // Lưu token nếu API trả về
                if (response.data.token) {
                  localStorage.setItem('authToken', response.data.token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                } else if (response.data.access_token) {
                  localStorage.setItem('authToken', response.data.access_token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                }
                
                // Resolve Promise với user
                resolve(user);
                
              } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                reject(error);
              }
            })
            .catch((error) => {
              console.error("Lỗi đăng nhập với Facebook:", error);
              reject(error);
            });
        });
      };

      // Sử dụng hàm này
      try {
        const user = await signInWithFacebook();
        setCurrentUser(user);
        setLoginError(null);
        return user;
      } catch (error) {
        setLoginError(error.message);
        return null;
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Đăng nhập Google bị hủy bởi người dùng');
        setError('Đăng nhập đã bị hủy. Vui lòng thử lại.');
      } else {
        console.error('Lỗi đăng nhập Google:', error);
        setError('Đăng nhập Google thất bại: ' + error.message);
      }
      throw error;
    }
  }

  // Đăng nhập với Twitter
  async function loginWithTwitter() {
    try {
      setError('');
      const signInWithTwitter = () => {
        return new Promise((resolve, reject) => {
          signInWithPopup(auth, twitterProvider)
            .then(async (result) => {
              const idToken = result._tokenResponse.idToken;
              console.log("Token đã được lưu:", idToken);

              try {
                // Gọi API đăng nhập với token ID từ Firebase
                const response = await axiosInstance.post('/auth/firebase/login', {
                  credential: idToken
                });
                
                console.log("Đăng nhập thành công:", response.data);
                
                // Lấy thông tin user từ response API hoặc từ result Twitter
                const user = response.data.user || result.user;
                
                // Lưu token nếu API trả về
                if (response.data.token) {
                  localStorage.setItem('authToken', response.data.token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                } else if (response.data.access_token) {
                  localStorage.setItem('authToken', response.data.access_token);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                }

                // Resolve Promise với user
                resolve(user);
                
              } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                reject(error);
              }
            })
            .catch((error) => {
              console.error("Lỗi đăng nhập với Twitter:", error);
              reject(error);
            });
        });
      };

      // Sử dụng hàm này
      try {
        const user = await signInWithTwitter();
        setCurrentUser(user);
        setLoginError(null);
        return user;
      } catch (error) {
        setLoginError(error.message);
        return null;
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Đăng nhập Twitter bị hủy bởi người dùng');
        // setError(t('auth.errors.twitter.failed') + t('auth.errors.login.cancelled'));
        setError("Lỗi Đăng Nhập");
      } else {
        console.error('Lỗi đăng nhập Twitter:', error);
        // setError(t('auth.errors.twitter.failed') + error.message);
        setError("Lỗi Đăng Nhập");
      }
      throw error;
    }
  }

  // Đăng ký tài khoản mới với API (bao gồm tên)
  async function registerWithApi(email, password) {
    try {
      setError('');
      
      // Gọi API đăng ký từ backend với thông tin đầy đủ
      const response = await axiosInstance.post('/auth/register', {
        email,
        password
      });
      
      // Lưu token nếu API trả về
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
      }
      
      const user = response.data.user.email || email;
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError('Đăng ký thất bại: ' + error.response?.data?.message || error.message);
      throw error;
    }
  }

  // Đăng xuất
  async function logout() {
    try {
      setError('');
      
      // Lấy token hiện tại
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Gọi API đăng xuất nếu cần
      try {
        if (refreshToken) {
          // Gọi API đăng xuất với refresh token để hủy
          await axiosInstance.post('/auth/logout', {
            refresh_token: refreshToken
          });
        } else {
          await axiosInstance.post('/auth/logout');
        }
      } catch (logoutError) {
        console.error('Lỗi gọi API đăng xuất:', logoutError);
      }
      
      // Xóa token từ localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Lấy ngôn ngữ hiện tại
      const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
      
      // Chuyển hướng về trang đăng nhập với ngôn ngữ hiện tại
      window.location.href = `/${currentLang}/login`;
    } catch (error) {
      setError('Đăng xuất thất bại: ' + error.message);
      throw error;
    }
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa từ token đã lưu
  useEffect(() => {
    let isMounted = true; // Sử dụng biến để kiểm tra component còn mounted hay không
    
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/auth/current');
        
        if (isMounted) {
          if (response.data && response.data.user) {
            setCurrentUser(response.data.user.email ? response.data.user.email : "TRAIOS");
            setIsAuthenticated(true);
            
            // Nếu truy cập được user, chuyển hướng đến trang analysis
            const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
            if (window.location.pathname.includes('/login') || window.location.pathname === '/') {
              window.location.href = `/${currentLang}/analysis`;
            }
          } else {
            resetAuthState();
          }
        }
      } catch (error) {
        console.error('Lỗi xác thực token:', error);
        if (isMounted) {
          // Thử dùng refresh token nếu có
          if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                // Gọi API để lấy token mới từ refresh token
                const response = await axiosInstance.post('/auth/refresh-token', {
                  refresh_token: refreshToken
                });
                
                if (response.data.access_token) {
                  const newToken = response.data.access_token;
                  // Lưu token mới và refresh token mới (nếu có)
                  localStorage.setItem('authToken', newToken);
                  if (response.data.refresh_token) {
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                  }
                  
                  // Cập nhật header Authorization
                  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                  
                  // Gọi lại API current user với token mới
                  const userResponse = await axiosInstance.get('/auth/current');
                  if (userResponse.data && userResponse.data.user) {
                    setCurrentUser(userResponse.data.user.email);
                    setIsAuthenticated(true);
                    
                    // Nếu truy cập được user, chuyển hướng đến trang analysis
                    const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
                    if (window.location.pathname.includes('/login') || window.location.pathname === '/') {
                      window.location.href = `/${currentLang}/analysis`;
                    }
                  } else {
                    resetAuthState();
                  }
                } else {
                  resetAuthState();
                }
              } catch (refreshError) {
                console.error('Lỗi refresh token:', refreshError);
                // Nếu lỗi refresh token là do token hết hạn/không hợp lệ
                if (refreshError.response && 
                   (refreshError.response.status === 401 || refreshError.response.status === 403)) {
                  // Xóa token và đăng xuất
                  resetAuthState();
                  
                  // Hiển thị thông báo cho người dùng
                  const message = i18n.t('auth.errors.token.refreshExpired', 
                                         'Your session has expired, please login again');
                  toast.error(message, {
                    position: "top-right",
                    autoClose: 5000
                  });
                  
                  // Lấy ngôn ngữ hiện tại từ localStorage nếu có
                  const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
                  
                  // Chuyển hướng đến trang đăng nhập
                  window.location.href = `/${currentLang}/login`;
                } else {
                  // Lỗi khác, chỉ reset state mà không điều hướng
                  resetAuthState();
                }
              }
            } else {
              resetAuthState();
            }
          } else {
            resetAuthState();
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Hàm helper để tránh lặp code
    const resetAuthState = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setCurrentUser(null);
    };
        
    checkAuthToken();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Hàm thay đổi mật khẩu
  const changePassword = async (oldPassword, newPassword) => {
    if (!currentUser) {
      throw new Error("No user is logged in");
    }
    
    try {
      // Gọi API endpoint thay đổi mật khẩu
      const response = await axiosInstance.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      // Kiểm tra xem có cần cập nhật token không
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        if (response.data?.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loginWithApi,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    loginWithTelegram,
    registerWithApi,
    logout,
    changePassword,
    error,
    setError,
    loginError,
    setLoginError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 