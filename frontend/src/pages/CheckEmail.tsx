import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import EmailSentIcon from "../assets/email-sent-icon-vector.jpg";

const CheckEmail: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    otp: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleConfirmOTP = async (e: React.FormEvent) => {
    e.preventDefault(); //prevent page reload

    console.log("OTP submitted:", formData.otp);
    const res = await axios.post(
      `${apiBaseUrl}/api/auth/verify-forgot-password-otp`,
      { email, OTP: formData.otp }
    );
    setMessage(" OTP Validated Successfully");
    console.log(res.data);
    navigate("/reset-password", { state: { email } });

    try {
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Check Email -- OTP  Failed"
      );
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 bg-white backdrop-blur-sm text-center p-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src={EmailSentIcon} alt="Check Email" className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Check your email!
          </CardTitle>
          <CardDescription className="mt-2 text-gray-500">
            We’ve sent you an email with a link to verify or reset your
            password. If you don’t see the email, please check your spam folder
            or contact{" "}
            <a
              href="mailto:support@kinety.com"
              className="text-orange-500 hover:underline"
            >
              support@photoCloud.com
            </a>
            .
          </CardDescription>
        </CardHeader>

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <CardContent className="flex flex-col gap-4 mt-6">
          <div>
            <form className="space-y-5" onSubmit={handleConfirmOTP}>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                OTP :
              </label>
              <input
                type="text"
                placeholder="6-DIGIT-OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
                required
              />
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
              >
                Confirm OTP
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center mt-4 gap-2">
          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
          >
            Resend email
          </Link>
          <Link
            to="/login"
            className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
          >
            ← Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckEmail;
