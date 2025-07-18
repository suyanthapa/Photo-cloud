import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ThreeDotMenu from "../components/ThreeDotMenu";
import { useNavigate } from "react-router-dom";

interface ReceivedData {
  id: number;
  description: string;
  photo: string;
  createdAt: string;
 user : {
     email : string
 }
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
    navigate(`photo/${id}`)
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Navbar />

      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-9">Shared With Me</h1>

        {received.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-6">Received Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {received.map((received) => (
                <div
                  key={received.id}
                  className="bg-white rounded-lg shadow-md relative"
                  >
                  <img
                    src={`${apiBaseUrl}/uploads/${received.photo}`}
                    alt={received.description || "Uploaded photo"}
                    className="w-full h-48 object-cover"
                    onClick={()=> handleInsideImage(received.id)}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div  >
                        <p className="text-gray-700 mb-1">
                          {received.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(received.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500">
                         Shared By :  {received.user.email}
                        </p>
                      </div>
                      {/* Just render the ThreeDotMenu component */}
                      <ThreeDotMenu uploadedId={received.id} />

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedWithMe;
