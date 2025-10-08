import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import axios, { type AxiosRequestConfig } from "axios";

export default function ThreeDotMenu({ uploadedId }: { uploadedId: number }) {
  const [open, setOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = async () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setShowConfirmModal(true);
    setOpen(false); // close the dropdown
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setMessage(""); // Clear any previous messages

    try {
      const config: AxiosRequestConfig = {
        data: { uploadedId },
        withCredentials: true,
      };
      console.log("Handle confirm Delete ------ID returned is :", uploadedId);
      const res = await axios.delete(
        `${apiBaseUrl}/api/data/deleteData`,
        config
      );

      setMessage("Deleted Successfully");
      console.log("response is", res.data);

      // Delay reload slightly to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Deletion failed."
      );
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      setShowConfirmModal(false);
      setMessage("");
    }
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Display message */}
      {message && (
        <div className="mt-2 text-sm text-red-600 text-center">{message}</div>
      )}

      {/* Fullscreen Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">
              {isDeleting
                ? "Deleting Photo..."
                : "Are you sure you want to delete?"}
            </h2>

            {isDeleting && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            )}

            {!isDeleting && (
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>
            )}

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.includes("Successfully")
                    ? "text-green-800 bg-green-50 border border-green-200"
                    : "text-red-800 bg-red-50 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`font-semibold py-2 px-4 rounded transition-colors ${
                  isDeleting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                className={`font-semibold py-2 px-4 rounded transition-colors ${
                  isDeleting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400 text-black"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
