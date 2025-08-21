import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/api/auth/register`, {
        email: formData.email,
        username: formData.email,
        password: formData.password,
      });
      setMessage("✅ OTP sent! Please check your email.");
      setOtpSent(true);

      navigate("/register/verify-otp", { state: { email: formData.email } });
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          " Failed to send OTP."
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        OTP: otp,
      });
      setMessage("Registration completed successfully!");
      console.log(res.data);
      setOtpSent(false);
      setFormData({ email: "", username: "", password: "" });
      setOtp("");
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "OTP verification failed."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-gray-200 bg-white backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create an Account
          </CardTitle>
          <CardDescription className="mt-1 text-gray-500">
            Fill in the details to join us
          </CardDescription>
          {message && (
            <p
              className={`mt-3 text-sm font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-5"
          >
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {otpSent && (
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}

            {!otpSent && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="yourusername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {otpSent ? "Verify OTP" : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-2 text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-green-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
