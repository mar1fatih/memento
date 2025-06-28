import './landpage.css';
function LandPage() {
  
  return (
  <>
  <header className="hero">
    <video autoPlay muted loop playsInline className="hero-video">
      <source src="src/assets/Memento_App_Video.mp4" type="video/mp4" />
    </video>
    <div className="hero-content">
      <h1>Your Memories, Always Accessible</h1>
      <p>Memento helps you save, organize, and relive your precious moments effortlessly.</p>
      <a href="#" className="btn-primary">Get Started</a>
      <a href="#" className="btn-secondary">See How It Works</a>
    </div>
  </header>

  <section className="features">
    <h2>Features</h2>
    <div className="features-grid">
      <div className="feature">
        <i className="icon-lock"></i>
        <h3>Secure Storage</h3>
        <p>Your memories are safely encrypted and stored in the cloud.</p>
      </div>
      <div className="feature">
        <i className="icon-folder"></i>
        <h3>Easy Organization</h3>
        <p>Find your photos quickly with smart albums and tags.</p>
      </div>
      <div className="feature">
        <i className="icon-cloud"></i>
        <h3>Access Anywhere</h3>
        <p>View your memories on any device, anywhere.</p>
      </div>
      <div className="feature">
        <i className="icon-share"></i>
        <h3>Share Memories</h3>
        <p>Effortlessly share special moments with friends and family.</p>
      </div>
    </div>
  </section>

  <section className="cta">
    <h2>Start saving your memories today.</h2>
    <a href="#" className="btn-primary">Get Started</a>
  </section>

  <footer>
    <p>&copy; 2025 Memento. All rights reserved.</p>
    <nav>
      <a href="#">About</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </nav>
  </footer>
  </>
  );
}

export default LandPage;