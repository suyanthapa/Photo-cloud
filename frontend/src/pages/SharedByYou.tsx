import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RawSharedItem {
  uploadData: {
    id: number;
    description: string;
    photo: string;
  };
  user: {
    id: number;
    email: string;
  };
}

interface GroupedSharedPhoto {
  id: number;
  photo: string;
  description: string;
  sharedWithUsers: {
    id: number;
    email: string;
  }[];
}

const SharedPhotosPage = () => {
  const [sharedPhotos, setSharedPhotos] = useState<GroupedSharedPhoto[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
   const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchSharedData = async () => {
    try {
      const res = await axios.get<{ data: RawSharedItem[] }>(
        `${apiBaseUrl}/api/data/share/viewSharedPhotos`,
        {
          withCredentials: true,
        }
      );

      const rawData = res.data.data;

      // Group by photo ID
      const grouped: Record<number, GroupedSharedPhoto> = {};

      rawData.forEach((item) => {
        const photoId = item.uploadData.id;

        if (!grouped[photoId]) {
          grouped[photoId] = {
            id: photoId,
            description: item.uploadData.description,
            photo: item.uploadData.photo,
            sharedWithUsers: [],
          };
        }

        grouped[photoId].sharedWithUsers.push({
          id: item.user.id,
          email: item.user.email,
        });
      });

      setSharedPhotos(Object.values(grouped));
    } catch (err: any) {
      console.error("Fetch error:", err.response?.data);
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch shared photos."
      );
    }
  };

  const handleInsideImage = (id: number) => {
    navigate(`photo/${id}`);
  };

  useEffect(() => {
    fetchSharedData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main className="px-40 py-5 flex justify-center">
        <div className="max-w-[960px] w-full">
          <div className="bg-white border border-[#dce0e5] rounded-xl p-5 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <p className="text-base font-bold text-[#111418]">
                These are the photos that you have shared
              </p>
              <p className="text-base text-[#637588]">
                Click a photo to view or edit
              </p>
            </div>
          </div>

          {sharedPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleInsideImage(photo.id)}
                >
                  <img
                    src={`${apiBaseUrl}/uploads/${photo.photo}`}
                    alt={photo.description || "Uploaded photo"}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-700 truncate">
                      {photo.description || "No description"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Shared with:{" "}
                      {photo.sharedWithUsers.map((u) => u.email).join(", ") ||
                        "None"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 mt-10">
              {message || "No photos shared to others."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SharedPhotosPage;
