import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../api/api.js';
import './photos.css';

function Photos({refresh, galleryWidth}) {
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
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [deletingProccess, setDeletingProccess] = useState(false);
  const [delProgress, setDelProgress] = useState(0);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [showPhoto, setShowPhoto] = useState(null);

  useEffect(() => {
    const handleResize = () => setPageWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  }

  const handleDeletePhotos = () => {
    setDeletingProccess(true);
    for (let photo of filteredSelect) {
      API.delete(`/photos/${photo}`)
      .then((res) => {
        setDelProgress(prev => prev + Math.ceil(100 / filteredSelect.length));
      })
      .catch(() => {
        setDeletingProccess(false);
        setDeleteWarning(false);
        setSelectionMode(false)
        setFileredSelect([]);
        setSelectedPhotos([]);
      });
    }
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
  }, [refresh]);

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

  useEffect(() => {
    if (delProgress >= 100) {
      setDeletingProccess(false);
      setDeleteWarning(false);
      setSelectionMode(false);
      setFileredSelect([]);
      setSelectedPhotos([]);
      window.location.href = '/gallery';
    }
  }, [delProgress]);

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
          >
            <div className='del-cancel-btn' 
              onClick={() => {
                setSelectionMode(false)
                setFileredSelect([]);
                setSelectedPhotos([]);
              }}
            ></div>
            <p className='selected'>{filteredSelect.length}&nbsp;selected</p>
            <div className='trash' onClick={() => setDeleteWarning(true)}></div>
          </div>
        )}
        {deleteWarning && (
          <div className='outside-delete'>
              <div className='delete-warning'>
                { deletingProccess && (
                  <>
                  <p style={{ paddingBottom: '40px' }}>deleting...</p>
                  <div className='delete-progress'>
                    <div className='delete-progress-bar' style={{ width: `${delProgress}%` }}></div>
                    <div className='delete-progress-text'>{delProgress}%</div>
                  </div></>)}
                { !deletingProccess && (<>
                  <p>Are you sure you want to permanently delete these photos? You won’t be able to recover them.</p>
                  <div className='delete-btn'>
                    <div className='cancel-delete' onClick={() => setDeleteWarning(false)}>Cancel</div>
                    <div className='confirm-delete' onClick={handleDeletePhotos}>Delete</div>
                  </div>
                </>)}
              </div>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo) =>
            <div
            className={filteredSelect.includes(photo._id) ? 'photos photos-checked' : 'photos'}
            key={photo._id}
            style={{
                height: pageWidth >= 800 ? `${Math.floor(galleryWidth / 5) - 7}px` : pageWidth >= 600 ? `${Math.floor(galleryWidth / 4) - 8}px` : `${Math.floor(galleryWidth / 3) - 4}px`,
                margin: pageWidth < 600 ? '1px' : '3px',
                width: pageWidth >= 800 ? `${Math.floor(galleryWidth / 5) - 7}px` : pageWidth >= 600 ? `${Math.floor(galleryWidth / 4) - 8}px` : `${Math.floor(galleryWidth / 3) - 4}px`
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
                      filter: (photo._id === hovered || filteredSelect.includes(photo._id)) && 'brightness(0.7)',
                    }}
                    onClick={() => {selectionMode ? handleCheckPhotos(photo._id) : window.location.href = `/gallery/${photo._id}`}}
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