import { useEffect, useState, useRef } from 'react';
import API from '../../api/api.js';
import Header from '../Header/header.jsx';
import Photos from '../Photos/photos.jsx';
import './gallery.css';

function Gallery() {
  const [files, setFiles] = useState([]); // State to hold the files selected for upload
  const [isLoading, setIsLoading] = useState(false); // State to hold a value of is loading
  const [isUploading, setIsUploading] = useState(false); // State to hold a value of is uploading
  const [refresh, setRefresh] = useState(false); // State to hold a boolean for refreshing the gallery
  const [isOpen, setIsOpen] = useState(false); // State to hold a boolean for sidebar visibility
  const [profileRight, setProfileRight] = useState('translatey(-411px)'); // State to hold the right of the profile content and the visibility
  const [profileOutside, setProfileOutside] = useState('0%'); // State to hold the height of the outside profile content and the functionality
  const [galleryClicked, setGalleryClicked] = useState(true); // State to hold a boolean for whether the gallery section is clicked
  const [progress, setProgress] = useState(0); // State to hold the progress of the upload
  const [userInfo, setUserInfo] = useState({}); // State to hold user information
  const [profilePicture, setProfilePicture] = useState('./src/assets/empty_profile_photo.png'); // State to hold the profile picture
  const [galleryWidth, setGalleryWidth] = useState(0);
  const gelleryRef = useRef(null);

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0 && files.length < 2) {
      setFileName(files[0].name);
      setFiles(files);
    } else if (files.length >= 2) {
      setFileName(files.length + ' files selected');
      setFiles(files);
    } else {
      setFileName('');
      setFiles([]);
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
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('photo', files[i]);
      setProgress(Math.round(((i + 1) / files.length) * 100));
      await API.post('/photos/upload', formData);
    }
    setFiles([]);
    setFileName('');
    setIsUploading(false);
    setProgress(0);
    // Refresh the gallery after upload
    setRefresh(!refresh);
    if (files.length > 1) alert('All photos uploaded!');
    else alert('Photo uploaded');
  };

  // Logout function to clear token and redirect to login page
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Handle profile click to toggle profile content visibility
  const handleProfileClick = () => {
    if (profileRight === 'translatey(-411px)') {
      setProfileRight('translatey(0px)');
      setProfileOutside('100%');
    } else {
      setProfileRight('translatey(-411px)');
      setProfileOutside('0%');
    }
  }

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', e.target.files[0]);
    API.post('/photos/profile-picture', formData)
      .then((res) => {
        setProfilePicture(res.data.profilePicture);
      })
      .catch((err) => {
        console.error('Failed to upload profile picture:', err);
      });
    setIsLoading(false);
    setProfileRight('translatey(-411px)'); // Close the profile content after changing the picture
    setProfileOutside('0%'); // Reset the outside profile content height
    setRefresh(!refresh); // Refresh the gallery to show the new profile picture
  }

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setGalleryWidth(entry.contentRect.width);
      }
    });

    if (gelleryRef.current) {
      observer.observe(gelleryRef.current);
    }

    return () => {
      if (gelleryRef.current) {
        observer.unobserve(gelleryRef.current);
      }
    };
  }, []);

  // Fetch photos from the API when the component mounts or when refresh state changes
  useEffect(() => {
    setIsLoading(true);
    API.get('/user')
      .then((res) => {
        setUserInfo({
          email: res.data.email,
          id: res.data._id,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          profilePicture: res.data.profilePicture === 'none' ? null : res.data.profilePicture,
        });
        if (res.data.profilePicture !== 'none') {
          setProfilePicture(res.data.profilePicture)
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        window.location.href = '/login';
      });
  }, []);

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
        <div className='profile-icon' style={{ backgroundImage: `url(${profilePicture.replace('/upload/', '/upload/c_scale,h_200/')})` }} onClick={handleProfileClick}>
          <div className='profile-icon-overlay'></div>
        </div>
        <div className='outside-profile' style={{ height: profileOutside }} onClick={handleProfileClick}></div>
        <div className='profile-content' style={{ transform: profileRight }}>
          <div className='profile-content-infos'>
            <div className='email'>{userInfo.email || '---------------'}</div>
            <div className='profile-picture' style={{ backgroundImage: `url(${profilePicture.replace('/upload/', '/upload/c_scale,h_400/')})` }}>
              <input type='file' accept='image/*' id='profile-picture-input' style={{ display: 'none' }} onChange={handleProfilePictureChange} />
              <label htmlFor='profile-picture-input' className='profile-picture-label'></label>
            </div>
            <div className='first-last-name'>{`${userInfo.lastName || '------'} ${userInfo.firstName || '-------'}`}</div>
          </div>
          <div className='profile-content-chnginfos'>
            <div className='change-info' onClick={() => { window.location.href = '/account'; }}>Change account infos</div>
            <div className='logout' onClick={logout}>
              <p>Logout</p>
              </div>
          </div>
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
        <div ref={gelleryRef} className='gallery-container'>
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
              <Photos refresh={refresh} galleryWidth={galleryWidth}/>
            )}
          </div>
          <div className='upload-section'>
            { isUploading ? (
              <div className='loading-container'>
                <div className='upload-loading'>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className='upload-progress'>
                  <div className='progress-bar' style={{ width: `${progress}%` }}></div>
                  <div className='progress-text'>{progress}%</div>
                </div>
              </div>
            ) : (
              <div className='upload-form'>
                <h2>Upload Photos</h2>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden-input"
                    multiple
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