import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import AuthHeader from "./AuthHeader";
import { authTheme } from "../styles/authTheme";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // 1️⃣ Determine flow from URL param
  const flowParam = params.flow; // 'register' or 'forgot-password'
  const flow: "register" | "forgot" =
    flowParam === "register" ? "register" : "forgot";

  // 2️⃣ Pull email from location.state
  const email = location.state?.email;

  // 3️⃣ Redirect if email missing
  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  // 4️⃣ Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // 5️⃣ Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // 6️⃣ Handle OTP verification
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const otpCode = otp.join("");

    // Validate OTP length
    if (otpCode.length !== 6) {
      setMessage("Please enter the full 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      // Call your backend API
      const res = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, {
        email,
        otp: otpCode,
      });

      setMessage("OTP Validated Successfully ✅");
      console.log("OTP verification response:", res.data);

      // Navigate based on flow
      if (flow === "register") {
        navigate("/login");
      } else {
        navigate("/forgot-password/reset-password", { state: { email } });
      }
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "OTP Verification Failed ❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage(""); // Clear any previous messages

    try {
      // Determine which endpoint to call based on flow
      const endpoint =
        flow === "register"
          ? `${apiBaseUrl}/api/auth/register`
          : `${apiBaseUrl}/api/auth/forgot-password`;

      await axios.post(endpoint, { email });

      setMessage("OTP resent successfully! ✅");
      setTimer(59); // Reset timer
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to resend OTP ❌"
      );
    } finally {
      setIsResending(false);
    }
  };

  // 7️⃣ Dynamic UI config
  const uiConfig = {
    register: {
      title: "Verify your email",
      description:
        "Enter the 6-digit OTP sent to your email to activate your account.",
      backRoute: "/register",
    },
    forgot: {
      title: "Reset Password",
      description:
        "Enter the 6-digit OTP sent to your email to reset your password.",
      backRoute: "/forgot-password",
    },
  }[flow];

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${authTheme.backgroundGradient} px-4 relative`}
    >
      <AuthHeader />
      <Card
        className={`${authTheme.card.base} ${authTheme.card.padding} text-center`}
      >
        <CardHeader>
          <CardTitle className={authTheme.text.title}>
            {uiConfig.title}
          </CardTitle>
          <CardDescription className={`mt-2 ${authTheme.text.subtitle}`}>
            {uiConfig.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  handleChange(e.target.value, i);
                  if (message) setMessage(""); // clear message while typing
                }}
                disabled={isLoading || isResending}
                className={`w-12 h-12 border border-gray-200 rounded-xl text-center text-xl font-semibold bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              />
            ))}
          </div>

          {/* Error/Success Message */}
          {message && (
            <div
              className={`mb-4 text-sm font-medium ${
                message.includes("✅")
                  ? authTheme.text.success
                  : authTheme.text.error
              }`}
            >
              {message}
            </div>
          )}

          {/* Timer + Resend */}
          <div
            className={`flex justify-between text-sm mb-6 ${authTheme.text.subtitle}`}
          >
            <span>
              Time left:{" "}
              <span className={`${authTheme.accent} font-medium`}>
                00:{timer.toString().padStart(2, "0")}
              </span>
            </span>
            <button
              disabled={timer > 0 || isResending || isLoading}
              onClick={handleResendOtp}
              className={`font-medium flex items-center gap-1 transition-colors ${
                timer > 0 || isResending || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : authTheme.text.link
              }`}
            >
              {isResending ? (
                <>
                  <Spinner size="sm" />
                  <span>Sending...</span>
                </>
              ) : (
                "Resend"
              )}
            </button>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || isResending}
            className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <Spinner size="sm" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col mt-4 gap-2">
          <button
            onClick={() => navigate(uiConfig.backRoute)}
            className={`hover:underline text-sm transition-colors ${authTheme.text.link}`}
          >
            ← Back
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OtpVerification;
