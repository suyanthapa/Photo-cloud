import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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

const Login: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      const res = await axios.post(`${apiBaseUrl}/api/auth/login`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage("✅ " + res.data.message);
        console.log("Login successful:", res.data.data);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "❌ Login Failed";
      setMessage(errorMessage);

      const status = err.response?.status;
      if (status === 403) {
        // Email not verified
        navigate("/sent-email", { state: { email: formData.email } });
      }
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
          <CardTitle className={authTheme.text.title}>Welcome Back</CardTitle>
          <CardDescription className={`mt-1 ${authTheme.text.subtitle}`}>
            Please sign in to continue
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

            <Button
              variant="default"
              type="submit"
              disabled={isLoading}
              className={`${authTheme.primaryButton.base} ${authTheme.primaryButton.gradient} ${authTheme.primaryButton.shadow}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter
          className={`flex flex-col items-center gap-2 text-sm ${authTheme.text.subtitle}`}
        >
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`font-medium hover:underline ${authTheme.text.link}`}
            >
              Register
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className={`hover:underline text-xs ${authTheme.text.link}`}
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
