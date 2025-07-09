import { useState } from 'react';
import API from '../../api/api.js';
import { useEffect } from 'react';
import './Account.css';

function Account() {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {    
    // Create twinkling stars
    setIsLoading(true);
    
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      const duration = Math.random() * 3 + 2;
      star.style.setProperty('--duration', `${duration}s`);
      
      starsContainer.appendChild(star);
    }

    API.get('/user')
      .then((res) => {
        setUserInfo(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user info:', err);
        setIsLoading(false);
      });
    
    return () => clearInterval();
  }, []);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    // Update password strength bar
    const strengthBar = document.querySelector('.password-strength-bar');
    if (strengthBar) {
      strengthBar.style.width = `${strength}%`;
      
      // Change color based on strength
      if (strength < 40) {
        strengthBar.style.background = '#ff4757'; // Weak (red)
      } else if (strength < 80) {
        strengthBar.style.background = '#ffa502'; // Medium (orange)
      } else {
        strengthBar.style.background = '#2ed573'; // Strong (green)
      }
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.put('/user', {
        firstName,
        lastName,
        password
      });
      if (response.status === 204) {
        alert('your account is successfully updated!');
        window.location.href = '/gallery';
      }
    } catch (error) {
        setIsLoading(false);
        alert(error + ' Password is wrong');
    }
  };

  return (
    <div className="register-body">
      <div className="stars" id="stars"></div>
      
      <div className="register-container">
        <div className="register-header">
          <h1>update your account information</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="register-input-group">
              <input type="text" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <label htmlFor="firstName">First Name</label>
            </div>
            
            <div className="register-input-group">
              <input type="text" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
          
          <div className="register-input-group">
            <input 
              type="password" 
              id="Oldpassword" 
              required 
              value={password}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label htmlFor="Oldpassword">*Old Password</label>
          </div>

          <div className="register-input-group">
            <input 
              type="password" 
              id="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <div className="password-strength">
              <div className="password-strength-bar"></div>
            </div>
          </div>
        
          <div className="register-input-group">
            <input type="password" id="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          {isLoading ? (
            <div className="spinner"></div>
            ) : (
              <button type="submit" className="register-button">Register</button>
              )}
          
          <div className="login-link">
            <p>{'(*) Required'}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Account;