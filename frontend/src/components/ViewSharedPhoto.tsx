import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

interface photoData {
  description: string;
  photo: string;
  id: number;
  createdAt: string;
  user: {
    email: string;
  };
}

const ViewSharedPhoto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<string>("");
  const [photoData, setPhotoData] = useState<photoData | null>(null);

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
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        <Navbar />
        <div className="flex flex-1 justify-center gap-1 px-6 py-5">
          <div className="flex w-full max-w-[700px] flex-col mx-auto">
            <div className="flex w-full grow bg-white py-3 justify-center">
              <img
                src={photoData.photo}
                alt="Uploaded"
                className="max-w-[500px] w-full max-h-[400px] rounded-md object-contain"
              />
            </div>
          </div>
          <div className="flex w-[360px] flex-col">
            <div className="grid grid-cols-[20%_1fr] gap-x-6 p-4 overflow-hidden">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm">Description</p>
                <p className="text-[#1C160C] text-sm flex gap-4 break-words overflow-hidden">
                  <span>{photoData.description}</span>
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm"> Date</p>
                <p className="text-[#1C160C] text-sm break-words overflow-hidden">
                  {formatDate(photoData.createdAt)}
                </p>
              </div>

              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm"> Shared By</p>
                <p className="text-[#1C160C] text-sm break-words overflow-hidden">
                  {photoData.user.email}
                </p>
              </div>
            </div>

            {/* Share UI */}
            {shared ? (
              <div className="flex flex-col gap-2 w-full mt-4">
                <input
                  type="text"
                  value={sharedGmail}
                  placeholder="Enter gmail to share with"
                  onChange={(e) => setSharedGmail(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-black min-h-[40px]"
                />

                <button
                  onClick={handleShareData}
                  className="w-full bg-[#019863] text-white px-4 py-2 rounded-md hover:bg-[#017a50] transition min-h-[40px]"
                >
                  Share
                </button>

                {message && (
                  <div
                    className={`text-center px-4 py-2 mt-2 rounded-md text-sm font-semibold ${
                      message.toLowerCase().includes("success")
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleShare}
                className="w-full h-10 px-4 bg-white text-green-700 border border-green-700 rounded flex items-center justify-center gap-2 text-sm font-semibold hover:bg-green-700 hover:text-white transition mt-4"
              >
                Share with Others
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSharedPhoto;
