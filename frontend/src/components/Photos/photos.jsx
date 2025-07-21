import { useState, useEffect, useRef, useCallback } from 'react';
import PhotoCard from '../PhotoCard/photoCard';
import API from '../../api/api.js';
import './photos.css'

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

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

  return (
    <>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo, index) =>
            <PhotoCard photo={photo} key={photo._id} />
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