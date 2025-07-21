import { useState } from 'react';
import API from '../../api/api.js';
import { useEffect, useRef } from 'react';
import './account.css';

function Account() {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [chngPass, setChngPass] = useState(false);
  const profilePicRef = useRef(null);

  useEffect(() => {    
    // Create twinkling stars
    setIsLoading(true);
    
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star-account');
      
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
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        profilePicRef.current = res.data.profilePicture.replace('/upload/', '/upload/h_200/');
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
    const strengthBar = document.querySelector('.password-strength-bar-account');
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

    if (password) {
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
          alert('invalid password 8 characters or more');
      }
    } else {
      try {
        const response = await API.put('/user', {
          firstName,
          lastName
        });
        if (response.status === 204) {
          alert('your account is successfully updated!');
          window.location.href = '/gallery';
        }
      } catch (error) {
          setIsLoading(false);
          alert(error + ' An error occured');
      }
    }
  };

  return (
    <div className="account-body">
      <div className="stars-account" id="stars"></div>
      
      <div className="account-container">
        <div className="account-header">
          <h1>update your account information</h1>
        </div>
        {profilePicRef.current && profilePicRef.current !== 'none' ? (
          <div className='account-profile-pic' style={{backgroundImage: `url(${profilePicRef.current})`}}></div>
        ) : (<></>)}
        
        <form onSubmit={handleSubmit}>
          <div className="name-fields-account">
            <div className="account-input-group">
              <input type="text" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <label htmlFor="firstName">First Name</label>
            </div>
            
            <div className="account-input-group">
              <input type="text" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          {chngPass ? (
            <>
              <div className="account-input-group">
                <input 
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">New Password</label>
                <div className="password-strength-account">
                  <div className="password-strength-bar-account"></div>
                </div>
              </div>
                
              <div className="account-input-group">
                <input type="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <button className="account-button-pass-keep" onClick={() => {setChngPass(false)}}>Keep Password</button>
            </>
          ) : (
            <button className="account-button" onClick={() => {setChngPass(true)}}>Change Password</button>
          )}

          {isLoading ? (
            <div className="spinner-account"></div>
            ) : (
              <button type="submit" className="account-button">Update</button>
              )}
        </form>
      </div>
    </div>
  );
}

export default Account;