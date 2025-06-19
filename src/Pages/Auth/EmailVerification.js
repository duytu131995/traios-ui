import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

function EmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // Giả lập việc xác thực email thành công sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/register-success');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Hàm để format email: giữ ký tự đầu và thay thế phần còn lại bằng dấu *
  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-logo">
          <Link to="/landing">
            <img src="/logo.svg" alt="TraiOS Logo" />
          </Link>
        </div>
        
        <h2>Mail sent successfully</h2>
        
        <div className="verify-message">
          <p>We have just sent email has sent to {maskEmail(email)} with a link to verify your email.</p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification; 