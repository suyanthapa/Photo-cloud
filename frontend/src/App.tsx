import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import UploadPage from "./pages/dashboard/upload";
import AllPhotos from "./pages/dashboard/AllPhotos";
import InsideImage from "./components/InsideImage";
import SharedPhotosPage from "./pages/dashboard/SharedByYou";
import SharedWithMe from "./pages/dashboard/SharedWithMe";
import ViewSharedPhoto from "./components/ViewSharedPhoto";
import ForgotPassword from "./pages/auth/ForgotPasword";
import ResetPassword from "./pages/auth/ResetPassword";
import SentEmail from "./pages/auth/EmailSent";
import OtpVerification from "./components/OtpVerification";
import UpdatePassword from "./pages/profile/updatePassword";
import ViewProfile from "./pages/profile/viewProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/sent-email" element={<SentEmail />} />

          <Route path="/:flow/verify-otp" element={<OtpVerification />} />
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

          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/view-profile" element={<ViewProfile />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
