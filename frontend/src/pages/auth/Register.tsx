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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear any previous messages

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear any previous messages

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
          <CardTitle className={authTheme.text.title}>
            Create an Account
          </CardTitle>
          <CardDescription className={`mt-1 ${authTheme.text.subtitle}`}>
            Fill in the details to join us
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
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-5"
          >
            <div>
              <label className={`block mb-2 ${authTheme.text.label}`}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
                required
              />
            </div>

            {otpSent && (
              <div>
                <label className={`block mb-2 ${authTheme.text.label}`}>
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {!otpSent && (
              <>
                <div>
                  <label className={`block mb-2 ${authTheme.text.label}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="yourusername"
                    className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${authTheme.text.label}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`${authTheme.input.base} ${authTheme.input.focus} ${authTheme.input.background}`}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>{otpSent ? "Verifying..." : "Sending OTP..."}</span>
                </div>
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter
          className={`flex flex-col items-center gap-2 text-sm ${authTheme.text.subtitle}`}
        >
          <p>
            Already have an account?{" "}
            <Link
              to="/"
              className={`font-medium hover:underline ${authTheme.text.link}`}
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
