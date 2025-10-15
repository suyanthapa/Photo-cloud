import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

interface UploadedData {
  id: string;
  description: string;
  photo: string;
  createdAt: string;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [uploads, setUploads] = useState<UploadedData[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      setFile(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!description.trim()) {
      alert("Please enter description");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("description", description);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/data/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(res.data);
      alert("Upload successful");

      // Reset form
      setDescription("");
      setFile(null);
      setPreviewUrl(null);

      // Fetch updated uploads
      fetchUploads();
    } catch (error: any) {
      console.error("Upload failed:", error.response ?? error.message);
      alert(
        "Upload failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/data/viewData`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUploads(res.data.data);
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Photos
          </h1>
          <p className="text-gray-600">
            Share your memories with friends and family
          </p>
        </div>
        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {/* Upload Area */}
          <div
            className="bg-gray-50 rounded-xl h-80 flex flex-col items-center justify-center text-center p-6 mb-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover h-full w-full rounded-xl shadow-sm"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition-colors shadow-lg"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Drop your photos here
                </h3>
                <p className="text-gray-500 mb-6">
                  or click to browse from your device
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Select Photos
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Photo Description
            </label>
            <textarea
              placeholder="Tell us about this photo..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !file || !description.trim()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isUploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>

        {/* Recent Uploads Section */}
        {uploads.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Uploads
              </h2>
              <span className="text-sm text-gray-500">
                {uploads.length} photos
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <img
                    src={upload.photo}
                    alt={upload.description}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-900 font-medium mb-1 line-clamp-2">
                      {upload.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(upload.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
