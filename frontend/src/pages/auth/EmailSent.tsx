import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import confirmationEmailIcon from "../assets/confirmation-email.jpg";

const SentEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      {/* Icon */}
      <img
        src={confirmationEmailIcon} // change path to your asset
        alt="Check Email"
        className="w-40 h-50 mb-6"
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Check your email
      </h1>

      {/* Subtitle */}
      <p className="text-center text-gray-600 mb-6">
        We sent a verification link to <br />
        <span className="font-medium text-blue-600">{email}</span>
      </p>

      {/* Enter code manually */}
      <button
        onClick={() => navigate("/verify-email", { state: { email } })}
        className="w-full max-w-xs bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition"
      >
        Enter code manually
      </button>

      {/* Back to login */}

      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors"
      >
        ← Back to Login
      </button>
    </div>
  );
};

export default SentEmail;
