import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import { useNavigate } from "react-router-dom";

interface ReceivedData {
  sharedAt: string;
  sharedBy: {
    id: number;
    username: string;
    email: string;
  };
  photo: {
    id: number;
    description: string;
    photo: string;
    createdAt: string;
  };
}

const SharedWithMe: React.FC = () => {
  const [received, setReceived] = useState<ReceivedData[]>([]);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchUploads = async () => {
    try {
      const res = await axios.get<{ data: ReceivedData[] }>(
        `${apiBaseUrl}/api/data/share/sharedPhotos`,
        {
          withCredentials: true,
        }
      );
      setReceived(res.data.data);
    } catch (error) {
      console.error("Failed to fetch uploads", error);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleInsideImage = async (id: number) => {
    navigate(`photo/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shared With Me
          </h1>
          <p className="text-gray-600">
            Photos that others have shared with you
          </p>
        </div>

        {received.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Received Photos ({received.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {received.map((receivedItem) => (
                <div
                  key={receivedItem.photo.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={receivedItem.photo.photo}
                      alt={receivedItem.photo.description || "Uploaded photo"}
                      className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                      onClick={() => handleInsideImage(receivedItem.photo.id)}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ThreeDotMenu uploadedId={receivedItem.photo.id} />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 font-medium mb-1 line-clamp-2">
                      {receivedItem.photo.description || "No description"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        {formatDate(receivedItem.photo.createdAt)}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Shared by: {receivedItem.sharedBy.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shared photos
            </h3>
            <p className="text-gray-500">
              When others share photos with you, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedWithMe;
