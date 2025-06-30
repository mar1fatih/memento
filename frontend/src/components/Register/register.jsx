import { useEffect, useState } from 'react';
import './Register.css';

const Register = () => {
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Create twinkling stars
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

    setPasswordStrength(strength);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration submitted');
  };

  return (
    <div className="register-body">
      <div className="stars" id="stars"></div>
      
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join us today and start your journey</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="register-input-group">
              <input type="text" id="firstName" required />
              <label htmlFor="firstName">First Name</label>
            </div>
            
            <div className="register-input-group">
              <input type="text" id="lastName" required />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>
          
          <div className="register-input-group">
            <input type="email" id="email" required />
            <label htmlFor="email">Email Address</label>
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
            <input type="password" id="confirmPassword" required />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          
          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          
          <button type="submit" className="register-button">Register</button>
          
          <div className="login-link">
            Already have an account? <a href="#">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;