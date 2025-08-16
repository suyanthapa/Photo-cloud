import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/upload";
import AllPhotos from "./pages/AllPhotos";
import InsideImage from "./components/InsideImage";
import SharedPhotosPage from "./pages/SharedByYou";

import SharedWithMe from "./pages/SharedWithMe";
import ViewSharedPhoto from "./components/ViewSharedPhoto";
import ForgotPassword from "./pages/ForgotPasword";
import CheckEmail from "./pages/CheckEmail";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/allPhotos" element={<AllPhotos />} />
        <Route path="/allPhotos/photo/:id" element={<InsideImage />} />
        <Route path="/sharedByYou" element={<SharedPhotosPage />} />
        <Route path="/sharedByYou/photo/:id" element={<InsideImage />} />
        <Route path="/sharedWithMe" element={<SharedWithMe />} />
        <Route path="/sharedWithMe/photo/:id" element={<ViewSharedPhoto />} />
      </Routes>
    </Router>
  );
}

export default App;
