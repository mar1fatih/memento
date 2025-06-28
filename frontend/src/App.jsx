import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/register.jsx';
import Login from './components/Login/login.jsx';
import Gallery from './components/Gallery/gallery.jsx';
import Upload from './components/Upload/upload.jsx';
import Header from './components/Header/header.jsx';
import Footer from './components/Footer/footer.jsx';
import './App.css'

function App() {
  return (
    <>
    <Header />
    <Router>
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
