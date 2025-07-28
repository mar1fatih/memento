import {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/notfound.jsx';
import API from '../../api/api.js';

function PhotoPreview() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { photoId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    API.get(`/photos/${photoId}`)
      .then()
      .catch((err) => <NotFound/>);
    API.get('/photos')
      .then((res) => {
        setPhotos([...res.data.photos]);
      })
      .catch((err) => {});
  }, []);

  return (
    <><div>{photos.map((photo) =>
        <div>photoUrl: {photo.url}</div>
    )}</div></>
  );
}

export default PhotoPreview;