

function PhotoCard({ photo }) {

  return (
    <div
    className='photos'
    key={photo._id}
    style={{
        height: '230px',
        margin: '10px',
        width: `${((photo.width / photo.height) * 230)}px`
    }}
    >
        <div
            className='photos-img'
            style={{ backgroundImage: `url(${photo.optimizedUrl || photo.url.replace('/upload/', '/upload/c_scale,h_230/')})` }}
        >
            <div className="select">
            <svg className='select-checked'>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            <svg className='select-not-checked'>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
            </svg>
            </div>
        </div>
        </div>
  );
}

export default PhotoCard;