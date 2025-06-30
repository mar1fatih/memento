import { useState } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import { useEffect } from 'react';
import './Login.css';


function Login() {
    useEffect(() => {
    // Create twinkling stars
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random size between 1px and 3px
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration between 2s and 5s
      const duration = Math.random() * 3 + 2;
      star.style.setProperty('--duration', `${duration}s`);
      
      starsContainer.appendChild(star);
    }

    // Add floating animation to login container
    const loginContainer = document.querySelector('.login-container');
    
    const floatAnimation = () => {
      loginContainer.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        loginContainer.style.transform = 'translateY(5px)';
        setTimeout(() => {
          loginContainer.style.transform = 'translateY(0)';
        }, 2000);
      }, 2000);
    };
    // Start the floating animation every 2 seconds
    const animationInterval = setInterval(floatAnimation, 2000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <>
        <div className="login-body">
      <div className="stars" id="stars"></div>
      
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to access your account</p>
        </div>
        
        <form>
          <div className="input-group">
            <input type="text" id="username" required />
            <label htmlFor="username">Username or Email</label>
          </div>
          
          <div className="input-group">
            <input type="password" id="password" required />
            <label htmlFor="password">Password</label>
          </div>
          
          <div className="remember-forgot">
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          
          <button type="submit" className="login-button">Login</button>
          
          <div className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};


export default Login;