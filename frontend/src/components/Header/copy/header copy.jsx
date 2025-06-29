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
        <nav>
            <Link to="/register">Register</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/gallery">Gallery</Link> |{" "}
            <Link to="/upload">Upload</Link> |{" "}
            <button className="logout-btn" onClick={logout}>Logout</button>
        </nav>
    </div>
  );
}

export default Header;