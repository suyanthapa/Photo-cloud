import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Spinner } from "../../components/ui/spinner";
import {
  User,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

const ViewProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/auth/me`, {
          withCredentials: true,
        });
        console.log("Response from /me:", res.data);
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendVerificationEmail = async () => {
    setVerifyingEmail(true);
    setVerificationMessage("");

    try {
      await axios.post(
        `${apiBaseUrl}/api/auth/send-verification-email`,
        { email: user?.email },
        { withCredentials: true }
      );
      setVerificationMessage(
        "✅ Verification email sent! Please check your inbox."
      );
    } catch (err: any) {
      setVerificationMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "❌ Failed to send verification email. Please try again."
      );
    } finally {
      setVerifyingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Profile
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Profile Data
            </h3>
            <p className="text-gray-600">No user data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-5 h-5" />
            <span className="font-medium">My Profile</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.username}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Username */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>

                {/* Account Created */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Account Created
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Status
              </h3>

              <div className="space-y-4">
                {/* Email Verification Status */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {user.isEmailVerified ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.isEmailVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isEmailVerified ? "Active" : "Pending"}
                    </span>
                  </div>

                  {/* Verification Message */}
                  {verificationMessage && (
                    <div
                      className={`mb-3 p-3 rounded-lg text-sm ${
                        verificationMessage.includes("✅")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {verificationMessage}
                    </div>
                  )}

                  {/* Verify Email Button - Only show if email is not verified */}
                  {!user.isEmailVerified && (
                    <button
                      onClick={handleSendVerificationEmail}
                      disabled={verifyingEmail}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      {verifyingEmail ? (
                        <>
                          <Spinner size="sm" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Verify Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Account Security */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Account Security
                      </p>
                      <p className="text-sm text-gray-600">
                        Password protected
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Secure
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/update-password")}
                  className="w-full py-3 px-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Change Password
                  </span>
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 px-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Back to Dashboard
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
