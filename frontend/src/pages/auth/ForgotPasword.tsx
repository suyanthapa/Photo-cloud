import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import AuthHeader from "../../components/AuthHeader";
import { authTheme } from "../../styles/authTheme";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear any previous messages

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center ${authTheme.backgroundGradient} px-4 relative`}
    >
      <AuthHeader />
      <Card className={`${authTheme.card.base} ${authTheme.card.padding}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <img
                src={forgotPasswordIcon}
                alt="Forgot Password"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <CardTitle className={authTheme.text.title}>
            Forgot your password?
          </CardTitle>
          <CardDescription className={`mt-1 ${authTheme.text.subtitle}`}>
            Enter your email so we can send you a password reset link
          </CardDescription>
          {message && (
            <p
              className={`mt-3 text-sm font-medium ${
                message.includes("✅")
                  ? authTheme.text.success
                  : authTheme.text.error
              }`}
            >
              {message}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block mb-2 ${authTheme.text.label}`}>
                Email
              </label>
              <input
                type="email"
                placeholder="e.g. username@example.com"
                className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Sending Email...</span>
                </div>
              ) : (
                "Send Email"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter
          className={`flex justify-center text-sm ${authTheme.text.subtitle}`}
        >
          <Link
            to="/login"
            className={`flex items-center gap-1 hover:underline ${authTheme.text.link} transition-colors`}
          >
            ← Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
