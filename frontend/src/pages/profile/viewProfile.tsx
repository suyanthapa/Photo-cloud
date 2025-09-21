import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

const ViewProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/auth/me`, {
          withCredentials: true,
        });
        console.log("Response from /me:", res.data);
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // <-- useEffect properly closed

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user)
    return <p className="text-center mt-10">No user data available.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold">Username:</span>
          <span>{user.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Created At::</span>
          <span>{user.createdAt}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Verified:</span>
          <span>
            {user.isEmailVerified ? (
              <span className="text-green-500 font-medium">Yes</span>
            ) : (
              <span className="text-red-500 font-medium">No</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
