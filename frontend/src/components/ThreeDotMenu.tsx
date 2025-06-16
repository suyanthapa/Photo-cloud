import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import axios, { type AxiosRequestConfig } from "axios";




export default function ThreeDotMenu({uploadedId}: {uploadedId:number}) {
  const [open, setOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
   const [message, setMessage] = useState('');
  

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

  const handleDelete = async () => {
    setShowConfirmModal(true);
    setOpen(false); // close the dropdown

   
  };


  const handleConfirmDelete = async() => {
     try{
      const config: AxiosRequestConfig ={
        data: {uploadedId},
        withCredentials : true
      }
      console.log("Hnadle confirm Delete ------ID returned is :",uploadedId)
        const res = await axios.delete(
        'http://localhost:8000/api/data/deleteData',config
      );


      console.log("lkll",res)
     
       setMessage('Deleted Successfully');
       console.log("response is",res.data);
    }
    catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Deletion failed.'
      );
    } 

     setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
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
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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

      {/* Fullscreen Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete?</h2>
            {/* <p className="text-gray-600 mb-6">This action cannot be undone.</p> */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
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
