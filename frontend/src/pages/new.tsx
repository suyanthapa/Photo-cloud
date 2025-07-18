import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type UploadedData = {
  id: number;
  photo: string;
  createdAt: string,
  description: string;
};

const Dashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState<UploadedData[]>([]);
  
   const apiBaseUrl = import.meta.env.VITE_API_URL;
   
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/data/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });
      console.log(res.data);
      alert('Upload successful');
      setDescription('');
      setFile(null);
      fetchUploads();
    } catch (error: any) {
      console.error('Upload failed:', error.response ?? error.message);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get<{ data: UploadedData[] }>('http://localhost:8000/api/data/viewData', {
        withCredentials: true, // IMPORTANT for sending cookies
      });
      setUploads(res.data.data);
    } catch (error) {
      console.error('Failed to fetch uploads', error);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []); // Run once on component mount

  const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
       
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-10">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Your Uploaded Files</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uploads.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">No uploads yet.</p>
        ) : (
          uploads.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden border">
               <Link to="/login" className="text-blue-600 hover:underline">
               <img
                src={`http://localhost:8000/uploads/${item.photo}`}
                alt="uploaded"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-800 text-sm">{item.description}</p>
                <p className="text-gray-500 text-xs mt-2">{formatDate(item.createdAt)}</p>

              </div>
               </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
