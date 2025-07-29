import {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/notfound.jsx';
import API from '../../api/api.js';

function PhotoPreview() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { photoId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    API.get(`/photos/${photoId}`)
      .then(res => console.log(res.status))
      .catch((err) => setNotFound(true));
    API.get('/photos')
      .then((res) => {
        setPhotos([...res.data.photos]);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
        {notFound ? <NotFound/> : isLoading && <><div>{photos.map((photo) =>
        <div>photoUrl: {photo.url}</div>
        )}</div></>}
    </>
  );
}

export default PhotoPreview;