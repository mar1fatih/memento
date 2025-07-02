import { useEffect, useState } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import './gallery.css';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handlephotoClick = () => {
    document.querySelector('.photos-section').style.display = 'block';
    document.querySelector('.upload-section').style.display = 'none';
  };
  const handleUploadClick = () => {
    document.querySelector('.photos-section').style.display = 'none';
    document.querySelector('.upload-section').style.display = 'block';
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', file);

    await API.post('/photos/upload', formData);
    setRefresh(!refresh);
    setFile(null);
    alert('Uploaded!');
  };

  // Logout function to clear token and redirect to login page
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
  }, [refresh]);

  return (
    <div>
      <Header />
      <div className='logout-btn'>
        <button onClick={logout}>Logout</button>

      </div>
      <div className='gallery-body'>
        <div className='nav-bar'>
          <div className='photos-nav' onClick={handlephotoClick}>
            <div className='photos-nav-icon'></div>
            <div className='photos-text'> Photos </div>
          </div>
          <div className='upload-nav' onClick={handleUploadClick}>
            <div className='upload-nav-icon'></div>
            <div className='upload-text'> Upload </div>
          </div>
        </div>
        <div className='gallery-container'>
          <div className='photos-section'>
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
          <div className='upload-section'>
            <h2>Upload Photo</h2>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;