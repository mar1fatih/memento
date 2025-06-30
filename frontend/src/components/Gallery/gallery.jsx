import { useEffect, useState } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';

function Gallery() {
  const [photos, setPhotos] = useState([]);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    API.get('/photos')
      .then((res) => setPhotos(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) window.location.href = '/login';
        else console.error('Failed to fetch photos:', err);
      });
  }, []);

  return (
    <div>
      <Header />
      <div className='logout-btn'>
        <button onClick={logout}>Logout</button>
      </div>
      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => (
          <img
            key={photo._id}
            src={photo.url}
            alt=""
            style={{ width: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;