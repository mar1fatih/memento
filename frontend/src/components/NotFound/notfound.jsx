import './notfound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="stars">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.5 + 0.5
          }}></div>
        ))}
      </div>
      
      <div className="astronaut">
        <div className="helmet"></div>
        <div className="face">
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="mouth"></div>
        </div>
        <div className="body"></div>
        <div className="left-arm"></div>
        <div className="right-arm"></div>
        <div className="left-leg"></div>
        <div className="right-leg"></div>
      </div>
      
      <div className="content">
        <h1>404</h1>
        <h2>Lost in Space</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <button 
          className="home-button"
          onClick={() => window.location.href = '/'}
        >
          Return to Earth
        </button>
      </div>
    </div>
  );
};

export default NotFound;