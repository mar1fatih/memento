import { Link } from 'react-router-dom';
import './header.css';

function Header() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className='header'>
        <div className='memento-logo'></div>
    </div>
  );
}

export default Header;