// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Cấu hình Firebase - sử dụng thông tin cấu hình thực tế của bạn
const firebaseConfig = {
  apiKey: "AIzaSyCW0aQl5mXcbpqsM6uRDAn_jcnrT7SU5yA",
  authDomain: "traios-19228.firebaseapp.com",
  projectId: "traios-19228",
  storageBucket: "traios-19228.appspot.com",
  messagingSenderId: "70929430405",
  appId: "1:70929430405:web:faec7911989c4a8aaff6ec",
  measurementId: "G-TQTL9HNER5"
};

// // Ghi log cấu hình để gỡ lỗi
// console.log('Firebase config:', {
//   ...firebaseConfig,
//   apiKey: '*** HIDDEN ***' // Ẩn API key khỏi nhật ký
// });

// Liệt kê domain hiện tại để gỡ lỗi
// console.log('Current domain:', window.location.hostname);
// console.log('Current origin:', window.location.origin);

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage();

// Cấu hình ngôn ngữ cho Auth (có thể thay đổi nếu cần)
auth.languageCode = 'vi-VN';

// Khởi tạo các provider cho đăng nhập mạng xã hội
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Khởi tạo Facebook provider
const facebookProvider = new FacebookAuthProvider();
// facebookProvider.addScope('email');
// facebookProvider.addScope('public_profile');
// facebookProvider.setCustomParameters({
//   'display': 'popup',
//   'auth_type': 'rerequest',
//   'return_scopes': 'true'
// });

// Khởi tạo Twitter provider
const twitterProvider = new TwitterAuthProvider();
// twitterProvider.setCustomParameters({
//   'lang': 'vi'
// });

// Ghi log các provider để gỡ lỗi
// console.log('Google provider initialized:', googleProvider);
// console.log('Facebook provider initialized:', facebookProvider);
// console.log('Twitter provider initialized:', twitterProvider);

export { app, auth, analytics, googleProvider, facebookProvider, twitterProvider };

