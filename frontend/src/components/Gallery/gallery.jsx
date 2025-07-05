import { useEffect, useState } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import './gallery.css';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileHeight, setProfileHeight] = useState('0px');
  const [profileOutside, setProfileOutside] = useState('0%');
  const [galleryClicked, setGalleryClicked] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // Close sidebar when overlay is clicked or when the void is clicked
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // switch between photos and upload sections
  const handlephotoClick = () => {
    document.querySelector('.photos-section').style.display = 'block';
    document.querySelector('.upload-section').style.display = 'none';
    setGalleryClicked(true);
    closeSidebar();
  };
  const handleUploadClick = () => {
    document.querySelector('.photos-section').style.display = 'none';
    document.querySelector('.upload-section').style.display = 'flex';
    setGalleryClicked(false);
    closeSidebar();
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

  // Handle profile click to toggle profile content visibility
  const handleProfileClick = () => {
    if (profileHeight === '0px') {
      setProfileHeight('350px');
      setProfileOutside('100%');
    } else {
      setProfileHeight('0px');
      setProfileOutside('0%');
    }
  }

  useEffect(() => {
    setIsLoading(true);
    API.get('/photos')
      .then((res) => {
        setPhotos(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) window.location.href = '/login';
        else console.error('Failed to fetch photos:', err);
      });
  }, [refresh]);

  return (
    <div>
      <div className='menu-bar' style={{ backgroundImage: isOpen ? 'url(./src/assets/close_menu_icon.svg)' : 'url(./src/assets/menu_icon.png)' }} onClick={toggleSidebar}></div>
      <div className='extended-menu' style={{ left: isOpen ? 0 : '-100%' }}>

        <div className='menu-items'>
          <div className='nav-bar-mobile'>
            <div className='photos-nav-mobile' onClick={handlephotoClick} style={{ backgroundColor: galleryClicked ? 'hsla(176, 37%, 60%, 0.651)' : 'transparent' }}>
              <div className='photos-nav-icon-mobile'></div>
              <div className='photos-text-mobile'> Photos </div>
            </div>
            <div className='upload-nav-mobile' onClick={handleUploadClick} style={{ backgroundColor: galleryClicked ? 'transparent' : 'hsla(176, 37%, 60%, 0.651)' }}>
              <div className='upload-nav-icon-mobile'></div>
              <div className='upload-text-mobile'> Upload </div>
            </div>
          </div>
        </div>

        <div className='menu-void' onClick={closeSidebar}></div>
      </div>
      <Header />

      <div className='profile-header'>
        <div className='profile-icon' style={{ backgroundImage: 'url(./src/assets/empty_profile_photo.png)' }} onClick={handleProfileClick}></div>
        <div className='outside-profile' style={{ height: profileOutside }} onClick={handleProfileClick}></div>
        <div className='profile-content' style={{ height: profileHeight }}>
        </div>
      </div>

      <div className='gallery-body'>
        <div className='nav-bar'>
          <div className='photos-nav' onClick={handlephotoClick} style={{ backgroundColor: galleryClicked ? 'hsla(176, 37%, 60%, 0.651)' : 'transparent' }}>
            <div className='photos-nav-icon'></div>
            <div className='photos-text'> Photos </div>
          </div>
          <div className='upload-nav' onClick={handleUploadClick} style={{ backgroundColor: galleryClicked ? 'transparent' : 'hsla(176, 37%, 60%, 0.651)' }}>
            <div className='upload-nav-icon'></div>
            <div className='upload-text'> Upload </div>
          </div>
        </div>
        <div className='gallery-container'>
          <div className='photos-section'>
            <h2>Gallery</h2>
            {isLoading ? (
              <div className='loading-container'>
                <div className='loading'>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map((photo) => (
                  <img
                    key={photo._id}
                    src={photo.optimizedUrl || photo.url.replace('/upload/', '/upload/c_scale,h_400/')}
                    alt=""
                    style={{ height: '200px', margin: '10px' }}
                  />
                ))}
              </div>)}
          </div>
          <div className='upload-section'>
            <div className='upload-form'>
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
    </div>
  );
}

export default Gallery;