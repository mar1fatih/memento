import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../api/api.js';
import './photos.css';

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [filteredSelect, setFileredSelect] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [checkHovered, setCheckHovered] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

  const observer = useRef();
  const lastPhoto = useCallback(ele => {
    if (isLoading) return
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore === true) {
        setPage(prev => totalPages > prev ? prev + 1 : prev);
      }
    });
    if (ele) observer.current.observe(ele);
  }, [isLoading, hasMore]);

  const handlePhotosMouseEnter = (index) => {
    setHovered(index);
  }
  const handlePhotosMouseLeave = () => {
    setHovered(null);
  }

  const handleCheckPhotoMouseEnter = index => {
    setHovered(index);
    setCheckHovered(index);
  }

  const handleCheckPhotoMouseLeave = () => {
    setCheckHovered(null);
  }

  const handleCheckPhotos = (photoId) => {
    if (filteredSelect.includes(photoId)) {
      if (filteredSelect.length > 1) {
        setFileredSelect(prev => prev.filter(id => id !== photoId));
      } else {
        setFileredSelect([]);
        setSelectedPhotos([]);
        setSelectionMode(false);
      }
    } else {
    setSelectedPhotos(prev => [...new Set([...prev, photoId])]);
    }
    console.log(typeof photoId);
  }

  useEffect(() => {
    setError(false);
    setIsLoading(true);
    API.get( `/photos?page=1&limit=10`)
      .then((res) => {
        setPhotos(res.data.photos);
        setTotalPages(res.data.totalPages);
        setTotalPhotos(res.data.totalPhotos);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setError(false);
    setIsLoading(true);
    fetchPhotos(page);
    setIsLoading(false);
  }, [page]);

  const fetchPhotos = async (pageToFetch) => {
    if (pageToFetch > totalPages) return
    await API.get(`/photos?page=${pageToFetch}&limit=10`)
      .then((res) => {
        if (pageToFetch > 1) setPhotos(prev => [...prev, ...res.data.photos]);
      })
      .catch((err) => {
        setError(true);
      });
  }

  useEffect(() => {
    setHasMore(photos.length < totalPhotos);
  }, [photos.length]);

  useEffect(() => {
    if (selectedPhotos.length > 0) {
      setSelectionMode(true);
      setFileredSelect([...new Set([...selectedPhotos])]);
      console.log(filteredSelect);
    } else {
      setSelectionMode(false);
    }
  }, [selectedPhotos]);

  return (
    <>
        {selectionMode && (
          <div 
          style={{
            position: 'fixed',
            left: '50px',
            top: '20px',
            display: 'flex',
          }}
        ><div className='del-cancel-btn' 
          onClick={() => {
            setSelectionMode(false)
            setFileredSelect([]);
            setSelectedPhotos([]);
          }}
        ></div>
        <p className='selected'>{filteredSelect.length}&nbsp;selected</p></div>
        )}
        <div>selected items: {filteredSelect.length}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo, index) =>
            <div
            className='photos'
            key={photo._id}
            style={{
                height: '230px',
                margin: '10px',
                width: `${((photo.width / photo.height) * 230)}px`
            }}
            onMouseEnter={() => handlePhotosMouseEnter(photo._id)}
            onMouseLeave={() => handlePhotosMouseLeave(photo._id)}
            >
                <div className="select">
                  <svg className='select-checked' style={{
                    display: filteredSelect.includes(photo._id) ? 'block' : (selectionMode ? 'none' : (photo._id === hovered && 'block')),
                    opacity: filteredSelect.includes(photo._id) && 1 || photo._id === checkHovered && 1 || photo._id === hovered && 0.5,
                    fill: filteredSelect.includes(photo._id) && 'hsla(217, 95%, 83%, 1.00)',
                    }}
                    onMouseEnter={() => handleCheckPhotoMouseEnter(photo._id)}
                    onMouseLeave={() => handleCheckPhotoMouseLeave(photo._id)}
                    onClick={() => handleCheckPhotos(photo._id)}
                  >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                  </svg>
                  <svg
                      className='select-not-checked'
                      style={{ display: filteredSelect.includes(photo._id) ? 'none' : (selectionMode ? 'block' : 'none') }}
                      onClick={() => setSelectedPhotos(prev => [...prev, photo._id])}
                  >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                  </svg>
                </div>
                <div
                    className='photos-img'
                    style={{
                      backgroundImage: `url(${photo.optimizedUrl || photo.url.replace('/upload/', '/upload/c_scale,h_230/')})`,
                      filter: photo._id === hovered && 'brightness(0.7)',
                    }}
                >
                </div>
            </div>
          )}
        </div>
        <div className='last item' style={{ height: '30px'}} ref={lastPhoto}></div>
        {isLoading &&
          <div className='loading-container'>
            <div className='loading'>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        }
        {error && <div style={{ height: '50px'}}>error</div>}
    </>
  );
}

export default Photos;