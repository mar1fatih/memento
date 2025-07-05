import { useEffect, useState, useRef } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import './gallery.css';

function Gallery() {
  const [photos, setPhotos] = useState([]); // State to hold the photos fetched from the API
  const [file, setFile] = useState(null); // State to hold the file selected for upload
  const [isLoading, setIsLoading] = useState(false); // State to hold a value of is loading
  const [isUploading, setIsUploading] = useState(false); // State to hold a value of is uploading
  const [refresh, setRefresh] = useState(false); // State to hold a boolean for refreshing the gallery
  const [isOpen, setIsOpen] = useState(false); // State to hold a boolean for sidebar visibility
  const [profileHeight, setProfileHeight] = useState('0px'); // State to hold the height of the profile content and the visibility
  const [profileOutside, setProfileOutside] = useState('0%'); // State to hold the height of the outside profile content and the functionality
  const [galleryClicked, setGalleryClicked] = useState(true); // State to hold a boolean for whether the gallery section is clicked


    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        setFile(file);
      } else {
        setFileName('');
      }
    };

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
    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    await API.post('/photos/upload', formData);
    setFile(null);
    setFileName('');
    setIsUploading(false);
    // Refresh the gallery after upload
    setRefresh(!refresh);
    alert('Uploaded!');
  };

  // Logout function to clear token and redirect to login page
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

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

  // Fetch photos from the API when the component mounts or when refresh state changes
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
            { isUploading ? (
              <div className='loading-container'>
                <div className='upload-loading'>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className='upload-form'>
                <h2>Upload Photo</h2>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden-input"
                  />
                  <label htmlFor="file-upload" className="custom-file-input">
                    {fileName || 'Choose a file'}
                  </label>
                  {fileName && (
                    <div className="button-group">
                      <button 
                        type="button" 
                        className="confirm-button"
                        onClick={handleUpload}
                        aria-label="Confirm file selection"
                      >
                        ✓
                      </button>
                      <button 
                        type="button" 
                        className="clear-button"
                        onClick={() => {
                          fileInputRef.current.value = '';
                          setFileName('');
                        }}
                        aria-label="Clear file selection"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;