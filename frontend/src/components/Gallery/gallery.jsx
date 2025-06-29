import { useEffect, useState } from 'react';
import API from '../../api/api.js';

function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    API.get('/photos')
      .then((res) => setPhotos(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => (
          <img
            key={photo._id}
            src={photo.url}
            alt=""
            style={{ width: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;