import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/upload';
import AllPhotos from './pages/AllPhotos';
import InsideImage from './components/InsideImage';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/allPhotos" element={<AllPhotos />} />
        <Route path="/allPhotos/photo/:id" element={<InsideImage />} />
      
        
        
      </Routes>
    </Router>
  );
}

export default App;
