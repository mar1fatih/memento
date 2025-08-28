import {useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotFound from '../NotFound/notfound.jsx';
import API from '../../api/api.js';
import './photopreview.css';

function PhotoPreview() {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { photoId } = useParams();
  const [pageWidth ,setPageWidth] = useState(1280);
  const [pageHeight, setPageHeight] = useState(587);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [mouseActive, setMouseActive] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const handleNext = () => {
    const photoDate = new Date(currentPhoto.photo.createdAt);
    const photo = photos.filter(photo => new Date(photo.createdAt) < photoDate );
    if (photo && photo.length > 0) {
      const photoone = photo[photo.length - 1];
      console.log(photoone);
      navigate(`/gallery/${photoone._id}`);
      setCurrentPhoto({photo: photoone});
    }
  }

  const handlePrevious = () => {
    const photoDate = new Date(currentPhoto.photo.createdAt);
    const photo = photos.filter(photo => new Date(photo.createdAt) > photoDate );
    if (photo && photo.length > 0) {
      const photoone = photo[0];
      navigate(`/gallery/${photoone._id}`);
      setCurrentPhoto({photo: photoone});
    }
  }

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);

    setMouseActive(true);
  };

  const handleMouseMove = () => {
    setMouseActive(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setMouseActive(false);
    }, 2500);
  }

  useEffect(() => {
    setIsLoading(true);
    API.get(`/photos/${photoId}`)
      .then((res) => {
        setCurrentPhoto({...res.data});
      })
      .catch((err) => setNotFound(true));
    
    API.get('/photos')
      .then((res) => {
        setPhotos([...res.data.photos]);
        setIsLoading(false);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth);
      setPageHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !notFound) {
      if (pageWidth > pageHeight / (currentPhoto.photo.height / currentPhoto.photo.width)) {
        setWidth(pageHeight / (currentPhoto.photo.height / currentPhoto.photo.width));
        setHeight(pageHeight);
        setLeft((pageWidth - (pageHeight / (currentPhoto.photo.height / currentPhoto.photo.width))) / 2);
        setTop(0);
      } else if (pageWidth <= pageHeight / (currentPhoto.photo.height / currentPhoto.photo.width)) {
        setWidth(pageWidth);
        setHeight(pageWidth * (currentPhoto.photo.height / currentPhoto.photo.width))
        setLeft(0);
        setTop((pageHeight - (pageWidth * (currentPhoto.photo.height / currentPhoto.photo.width))) / 2);
      }
    }
  }, [pageWidth, pageHeight, isLoading, currentPhoto]);

  return (
    <>
        {notFound ? <NotFound/> : !isLoading && <><div>
          <div className='preview-menu' style={{ opacity: !mouseActive && 0 }} onMouseEnter={handleMouseEnter}>
            <div className='preview-return-btn' onClick={() => window.location.href = '../gallery'}>
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
              </svg>
            </div>
            <div className='preview-properties'>
              <div className='preview-info'>
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                </svg>
              </div>
              <div className='preview-delete'>
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                  <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className='preview-properties-bar'></div>
          <div className='photo-container' style={{
            height: pageHeight + 'px',
            width: pageWidth + 'px',
            backgroundColor: 'black',
            }}
            onMouseMove={handleMouseMove}
            >
            <div className='previous-container' style={{
              height: pageHeight + 'px',
              width: (pageWidth * 0.313) + 'px',
              zIndex: 2,
              position: 'absolute',
              left: 0,
              cursor: 'pointer',
            }}
            onClick={handlePrevious}
            >
              <div className='previous-btn'><svg width="36px" height="36px" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path></svg></div>
            </div>
            <div className='photo-preview' style={{
              backgroundImage: `url(${currentPhoto.photo.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: height + 'px',
              width: width + 'px',
              position: 'absolute',
              left: left + 'px',
              top: top + 'px',
              }}></div>
            <div className='next-container' style={{
              height: pageHeight + 'px',
              width: (pageWidth * 0.313) + 'px',
              zIndex: 2,
              position: 'absolute',
              right: 0,
              cursor: 'pointer',
            }}
            onClick={handleNext}
            >
              <div className='next-btn'><svg width="36px" height="36px" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></svg></div>
            </div>
          </div>
        </div></>}
    </>
  );
}

export default PhotoPreview;