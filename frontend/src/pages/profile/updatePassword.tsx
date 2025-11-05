import { useState } from "react";
import axios from "axios";
import { Spinner } from "../../components/ui/spinner";
import { authTheme } from "../../styles/authTheme";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/auth/update-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        { withCredentials: true }
      );

      setSuccess(response.data.message || "✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Pattern similar to your login function
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Failed to change password";

      setError(msg);

      // Optional: handle specific status codes if needed
      if (err.response?.status === 401) {
        // Invalid current password or unauthorized
        setError(err.response.data.message || "Invalid current password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${authTheme.backgroundGradient} relative`}>
      {/* Header */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="flex justify-center items-center min-h-screen px-4">
        <div className={`${authTheme.card.base} ${authTheme.card.padding} w-full max-w-md`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className={authTheme.text.title}>Change Password</h2>
            <p className={`mt-2 ${authTheme.text.subtitle}`}>
              Update your account password for better security
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl bg-red-50 border border-red-200 ${authTheme.text.error}`}>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className={`mb-6 p-4 rounded-xl bg-green-50 border border-green-200 ${authTheme.text.success}`}>
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className={`block mb-2 ${authTheme.text.label}`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your current password"
                  className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block mb-2 ${authTheme.text.label}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your new password"
                  className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded ${/[0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password strength: {newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Weak'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block mb-2 ${authTheme.text.label}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Confirm your new password"
                  className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword && (
                <p className={`text-xs mt-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || newPassword !== confirmPassword}
              className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Spinner size="sm" />
                  <span>Updating Password...</span>
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Security Tips</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Avoid using personal information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
