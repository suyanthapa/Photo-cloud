import React, { useState } from "react";
import { Button } from "../../components/ui/button";
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

    const res = await axios.post(`${apiBaseUrl}/api/auth/reset-password`, {
      email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    setMessage(" OTP Validated Successfully");
    console.log(res.data);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <img
            src={ResetPasswordIcon}
            alt="Check Email"
            className="w-24 h-24"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-6">
          Please kindly set your new password
        </p>

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              New password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
              required
            />
            <p className="text-sm mt-1 text-green-600">
              Password strength: {passwordStrength(formData.password)}
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
