import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
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
    }
  };

  // 7️⃣ Dynamic UI config
  const uiConfig = {
    register: {
      title: "Verify your email",
      description:
        "Enter the 6-digit OTP sent to your email to activate your account.",
      primaryColor: "bg-orange-500 hover:bg-orange-600",
      textColor: "text-orange-500",
      backRoute: "/register",
      focusRing: "focus:ring-orange-400",
    },
    forgot: {
      title: "Reset Password",
      description:
        "Enter the 6-digit OTP sent to your email to reset your password.",
      primaryColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-blue-600",
      backRoute: "/forgot-password",
      focusRing: "focus:ring-blue-400",
    },
  }[flow];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200 bg-white p-8 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {uiConfig.title}
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
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
                className={`w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold ${uiConfig.focusRing} outline-none`}
              />
            ))}
          </div>

          {/* Error/Success Message */}
          {message && (
            <div
              className={`mb-4 text-sm font-medium
                  text-red-600
                  text-gray-600
              }`}
            >
              {message}
            </div>
          )}

          {/* Timer + Resend */}
          <div className="flex justify-between text-sm text-gray-600 mb-6">
            <span>
              Time left:{" "}
              <span className={`${uiConfig.textColor} font-medium`}>
                00:{timer.toString().padStart(2, "0")}
              </span>
            </span>
            <button
              disabled={timer > 0}
              onClick={() => setTimer(59)}
              className={`font-medium ${
                timer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : uiConfig.textColor
              }`}
            >
              Resend
            </button>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className={`w-full text-white py-3 rounded-lg font-medium transition ${uiConfig.primaryColor}`}
          >
            Verify OTP
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col mt-4 gap-2">
          <button
            onClick={() => navigate(uiConfig.backRoute)}
            className="text-gray-500 hover:underline text-sm"
          >
            ← Back
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OtpVerification;
