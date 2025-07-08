import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register/register.jsx';
import Login from './components/Login/login.jsx';
import Gallery from './components/Gallery/gallery.jsx';
import Account from './components/Account/account.jsx';
import LandPage from './components/LandPage/landpage.jsx';
import './App.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
