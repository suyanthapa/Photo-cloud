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

import ResetPassword from "./pages/ResetPassword";

import SentEmail from "./pages/EmailSent";
// import VerifyOTP from "./pages/CheckEmail";
import OtpVerification from "./components/OtpVerification";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/sent-email" element={<SentEmail />} />

        <Route path="/:flow/verify-otp" element={<OtpVerification />} />

        <Route path="/verify-email" element={<SentEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/:flow/reset-password" element={<ResetPassword />} />
        {/* <Route path="/verify-email" element={<VerifyOTP />} /> */}
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
