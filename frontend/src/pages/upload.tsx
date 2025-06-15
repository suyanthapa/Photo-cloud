import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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
      alert('Please select a file');
      return;
    }
    if (!description.trim()) {
      alert('Please enter description');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    try {
      const res = await axios.post('http://localhost:8000/api/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });
      alert('Upload successful');
      
      // Reset form
      setDescription('');
      setFile(null);
      setPreviewUrl(null);
      
      // Fetch updated uploads
      fetchUploads();
    } catch (error: any) {
      console.error('Upload failed:', error.response ?? error.message);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get<{ data: UploadedData[] }>('http://localhost:8000/api/data/viewData', {
        withCredentials: true,
      });
      setUploads(res.data.data);
    } catch (error) {
      console.error('Failed to fetch uploads', error);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Navbar />
      
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-9">Upload a Photo</h1>

        {/* Upload Area */}
        <div
          className="bg-gray-100 rounded-xl h-80 flex flex-col items-center justify-center text-center p-6 mb-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover h-full w-full rounded-xl"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold mb-4">Drag and drop your photo here</p>
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
                  className="flex items-center border px-4 py-2 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-600">Or select a file from your computer</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Description Input */}
        <textarea
          placeholder="Add a description"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || !file || !description.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Uploaded Photos Display */}
        {uploads.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Your Uploaded Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div key={upload.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                 <img
                  src={`http://localhost:8000/uploads/${upload.photo}`}
                  alt={upload.description}
                  className="w-full h-48 object-cover"
                />

                  <div className="p-4">
                    <p className="text-gray-700 mb-2">{upload.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(upload.createdAt)}</p>
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