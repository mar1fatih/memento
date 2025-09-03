import {useState, useEffect, useRef, use} from 'react';
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
  const [pageWidth ,setPageWidth] = useState(window.innerWidth);
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [mouseActive, setMouseActive] = useState(false);
  const [infoTab, setInfoTab] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false);
  const [deletingProccess, setDeletingProccess] = useState(false);
  const [delProgress, setDelProgress] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const datetime = useRef({});

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
    }, 4000);
  }

  //download photo
  const handleDownload = async () => {
    try {
      // Fetch the image data
      const response = await fetch(currentPhoto.photo.url, { mode: "cors" });
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = currentPhoto.photo.name || "photo.jpg"; // Filename for download
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const deleteFromArray = photoId => {
    setPhotos(prev => prev.filter(photo => photo._id != photoId ));
  };

  const handleDeletePhotos = () => {
    const last = photos[0]._id;

    setDeletingProccess(true);
    if (currentPhoto.photo._id === photos[photos.length - 1]._id) last
    API.delete(`/photos/${currentPhoto.photo._id}`)
    .then(() => {
      setDeleteAction(false);
      setDeletingProccess(false);
      setDelProgress(0);
      deleteFromArray(currentPhoto.photo._id);
      console.log(currentPhoto.photo._id, last);
      if (currentPhoto.photo._id === last) handlePrevious();
      else handleNext();
    })
    .catch(() => {
      setDeletingProccess(false);
      setDeleteAction(false);
      setDelProgress(0);
    });
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
    if (currentPhoto.photo && !notFound) {
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
  }, [pageWidth, pageHeight, isLoading, currentPhoto.photo]);

  useEffect(() => {
    if (!isLoading && !notFound) {
      const dateObj = new Date(currentPhoto.photo.createdAt);
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      console.log(dateObj.toLocaleString("en-US", { month: "long", timeZone: "UTC" }));

      datetime.current = {
        day: days[dateObj.getUTCDay()],
        month: dateObj.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
        year: currentPhoto.photo.createdAt.split("-")[0],
        time: currentPhoto.photo.createdAt.split('T')[1].split(':').slice(0, 2).join(':'),
      }
    }
  }, [currentPhoto, isLoading]);

  useEffect(() => {
    if (!deletingProccess) {
      setDelProgress(0);
      return;
    }

    if (delProgress >= 100) {
      return;
    }

    const interval = setInterval(() => {
      setDelProgress(prev => prev + 1);
    }, 30); // adjust speed here

    return () => clearInterval(interval); // cleanup
  }, [deletingProccess, delProgress, deleteAction]);

  return (
    <>
        {notFound ? <NotFound/> : !isLoading && <><div>
          {deleteAction && <div className='delete-component'>
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
                  <p>Are you sure you want to permanently delete that photos? You won’t be able to recover it.</p>
                  <div className='delete-btn'>
                    <div className='cancel-delete' onClick={() => setDeleteAction(false)}>Cancel</div>
                    <div className='confirm-delete' onClick={handleDeletePhotos}>Delete</div>
                  </div>
                </>)}
              </div>
          </div>
          </div>}
          <div className='preview-menu' style={{ opacity: !mouseActive && 0 }} onMouseEnter={handleMouseEnter}>
            <div className='preview-return-btn' onClick={() => window.location.href = '../gallery'}>
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
              </svg>
            </div>
            <div className='preview-properties'>
              <div className='preview-info' onClick={() => setInfoTab(prev => !prev)}>
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                </svg>
                <div className='preview-info-tab' style={{
                    transform: !infoTab && `translateY(-500px)`,
                    height: pageHeight <= 500 ? pageHeight - 100 + 'px' : '400px',
                    width: pageWidth <= 800 ? pageWidth - 500 + 'px' : '300px',
                    minWidth: '280px',
                    minHeight: '300px',
                  }}>
                  <h2 style={{color: 'white', alignContent: 'center'}}>Info</h2>
                  <div>{currentPhoto.photo.name}</div>
                  <div><b>Size</b> {(currentPhoto.photo.size / 1000000).toFixed(2)}mb</div>
                  <div><b>Dimensions</b> {currentPhoto.photo.height}/{currentPhoto.photo.width}</div>
                  <div><b>Uploaded at</b>
                    <div style={{display: 'flex'}}><p style={{ fontWeight: 600}}>{datetime.current.day}</p>, {datetime.current.month} {datetime.current.year}</div>
                    <div>{datetime.current.time} (UTC)</div>
                  </div>
                </div>
              </div>
              <div className='preview-delete' onClick={() => setDeleteAction(true)}>
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                  <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z"></path>
                </svg>
              </div>
              <div className='preview-download' onClick={handleDownload}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z"/>
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