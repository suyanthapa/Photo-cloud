import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ThreeDotMenu from "../components/ThreeDotMenu";
import { useNavigate } from "react-router-dom";

interface UploadedData {
  id: number;
  description: string;
  photo: string;
  createdAt: string;
}

const AllPhotos: React.FC = () => {
  const [uploads, setUploads] = useState<UploadedData[]>([]);
  const navigate = useNavigate();

  const fetchUploads = async () => {
    try {
      const res = await axios.get<{ data: UploadedData[] }>(
        "http://localhost:8000/api/data/viewData",
        {
          withCredentials: true,
        }
      );
      setUploads(res.data.data);
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
        <h1 className="text-2xl font-bold mb-9">Photo Gallery</h1>

        {uploads.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="bg-white rounded-lg shadow-md relative"
                  >
                  <img
                    src={`http://localhost:8000/uploads/${upload.photo}`}
                    alt={upload.description || "Uploaded photo"}
                    className="w-full h-48 object-cover"
                    onClick={()=> handleInsideImage(upload.id)}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div  >
                        <p className="text-gray-700 mb-1">
                          {upload.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(upload.createdAt)}
                        </p>
                      </div>
                      {/* Just render the ThreeDotMenu component */}
                      <ThreeDotMenu uploadedId={upload.id} />

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

export default AllPhotos;
