import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      await axios.post(
        `${apiBaseUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Logout failed");
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            {message && <p className="text-red-600 text-sm mb-2">{message}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
