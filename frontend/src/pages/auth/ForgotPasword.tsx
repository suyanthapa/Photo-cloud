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
import forgotPasswordIcon from "../../assets/forgot-password.jpg";

const ForgotPassword: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/forgot-password`, {
        email,
      });
      console.log(res.data);

      // Navigate to OTP verification page and pass email & flow
      navigate("/forgot-password/verify-otp", {
        state: { email },
      });
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to send reset link"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-gray-200 bg-white backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-7">
            <img
              src={forgotPasswordIcon}
              alt="Check Email"
              className="w-40 h-50"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Forgot your password?
          </CardTitle>
          <CardDescription className="mt-1 text-gray-500">
            Enter your email so we can send you a password reset link
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="e.g. username@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              variant="default"
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Send Email
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-600">
          <Link
            to="/login"
            className="flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors"
          >
            ← Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
