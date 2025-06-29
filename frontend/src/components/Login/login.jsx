import { useState } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    window.location.href = '/gallery';
  };

  return (
    <>
        <Header />
        <div className='login-form'>
            <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
              <button type="submit">Login</button>
            </form>
        </div>
    </>
  );
}

export default Login;