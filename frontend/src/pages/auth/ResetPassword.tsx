import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import AuthHeader from "../../components/AuthHeader";
import { authTheme } from "../../styles/authTheme";
import ResetPasswordIcon from "../../assets/reset-password.png";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Example password strength function
  const passwordStrength = (password: string) => {
    if (!password) return "";
    if (password.length > 8) return "Excellent";
    if (password.length > 5) return "Medium";
    return "Weak";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/reset-password`, {
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setMessage("✅ Password reset successfully");
      console.log(res.data);
      navigate("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Failed to reset password";
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${authTheme.backgroundGradient} px-4 relative`}
    >
      <AuthHeader />
      <div
        className={`${authTheme.card.base} ${authTheme.card.padding} text-center`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <img
              src={ResetPasswordIcon}
              alt="Reset Password"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        <h2 className={`mb-2 ${authTheme.text.title}`}>Reset Password</h2>
        <p className={`mb-6 ${authTheme.text.subtitle}`}>
          Please kindly set your new password
        </p>

        {message && (
          <p
            className={`text-sm mb-4 font-medium ${
              message.includes("✅")
                ? authTheme.text.success
                : authTheme.text.error
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className={`block mb-2 ${authTheme.text.label}`}>
              New password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
              required
            />
            <p className={`text-sm mt-1 ${authTheme.text.success}`}>
              Password strength: {passwordStrength(formData.password)}
            </p>
          </div>

          <div>
            <label className={`block mb-2 ${authTheme.text.label}`}>
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <Spinner size="sm" />
                <span>Saving Changes...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
