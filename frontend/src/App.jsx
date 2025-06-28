import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import Gallery from './components/gallery.jsx';
import Upload from './components/upload.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import './App.css'

function App() {
  return (
    <>
    <Header />
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
    <Footer />
    </>
  )
}

export default App
