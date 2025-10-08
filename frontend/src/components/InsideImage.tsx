import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, Share2, Calendar, User, Eye } from "lucide-react";

interface photoData {
  description: string;
  photo: string;
  id: number;
  createdAt: string;
}

const InsideImage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [photoData, setPhotoData] = useState<photoData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [sharedGmail, setSharedGmail] = useState("");
  const [shared, setShared] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        console.log("response vanda mathi");
        const res = await axios.get(
          `${apiBaseUrl}/api/data/viewSingleData/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("response data is", res);
        setPhotoData(res.data.data);
      } catch (err: any) {
        setMessage(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load data."
        );
      }
    };
    if (id) {
      fetchPhoto();
    }
  }, [id]);

  if (!photoData) {
    if (message) {
      return <div className="text-center py-10 text-red-600">{message}</div>;
    }
    return <div className="text-center py-10">Loading...</div>;
  }

  const handleEditClick = () => {
    setEditedDescription(photoData?.description || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDescription(photoData?.description || "");
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${apiBaseUrl}/api/data/editData`,
        {
          uploadedId: photoData.id,
          description: editedDescription,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      setPhotoData((prev) =>
        prev ? { ...prev, description: editedDescription } : prev
      );
      setIsEditing(false);
      setMessage("Editing Updated Successfully");
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Deletion failed."
      );
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleShare = async () => {
    setShared(true);
  };

  const handleShareData = async () => {
    try {
      console.log("Payload", {
        receiverEmail: sharedGmail,
        photoId: photoData.id,
      });

      console.log("type", typeof sharedGmail); // should log: number

      const res = await axios.post(
        `${apiBaseUrl}/api/data/share/sharePhoto`,
        {
          receiverEmail: sharedGmail,
          photoId: photoData.id,
        },
        { withCredentials: true }
      );
      console.log(res);
      setMessage(res.data.message);
    } catch (err: any) {
      console.log("Error response:", err.response?.data);
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to share data."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-600">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Photo Details</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-center">
                <img
                  src={photoData.photo}
                  alt={photoData.description}
                  className="max-w-full max-h-[600px] rounded-lg object-contain shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Photo Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Photo Information
              </h3>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1 text-gray-900">
                        {photoData.description}
                      </span>
                      <button
                        onClick={handleEditClick}
                        className="flex-shrink-0 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Upload Date
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {formatDate(photoData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Photo
              </h3>

              {!shared ? (
                <button
                  onClick={handleShare}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share with Others
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={sharedGmail}
                      placeholder="Enter email address"
                      onChange={(e) => setSharedGmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleShareData}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setShared(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                    message.toLowerCase().includes("success")
                      ? "text-green-800 bg-green-50 border border-green-200"
                      : "text-red-800 bg-red-50 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideImage;
