
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

interface sharedData {
    user: {

            id: number,
            description : string,
            photo : string,
            createdAt : string
        }

    uploadData: {
        id : number,
        description : string,
        photo : string
    }
}
const SharedByYou = () => {
  const images = [
    "https://cdn.usegalileo.ai/sdxl10/b105e251-6b00-4590-9022-bfb4411ac170.png",
    "https://cdn.usegalileo.ai/sdxl10/96a1f5cc-4465-466a-990b-5f3ee5e4ea90.png",
    "https://cdn.usegalileo.ai/sdxl10/ccfae0ee-1f2f-45ae-a3bf-2b67b402ce52.png",
    "https://cdn.usegalileo.ai/sdxl10/fb503a98-e470-434d-be1b-b5ad9703a166.png",
    "https://cdn.usegalileo.ai/sdxl10/280a1a13-b902-4048-8b49-8256367f91eb.png",
    "https://cdn.usegalileo.ai/sdxl10/6400987f-3d23-43c2-86e8-72a89d8a9b15.png",
    "https://cdn.usegalileo.ai/sdxl10/8fb87f7b-d1a2-434f-8d1d-16185d4ea4e0.png",
    "https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png",
  ];



  const [sharedData, setShareData] = useState <sharedData[]>([]);
  const [message , setMessage] = useState('');


  const fetchSharedData = async () => {

    try{
        const res = await axios.get<{data :  sharedData[]}>(
            "http://localhost:8000/api/data/share/viewSharedPhotos",
            {
                withCredentials: true
            }
        )

        setShareData(res.data.data);
        
    }
    catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to fetched shared Photos.'
      );
    }

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
              <p className="text-base font-bold text-[#111418]">These are the photos that are shared with others</p>
              <p className="text-base text-[#637588]">You can click the photo and view this setting</p>
            </div>
            
          </div>

          {sharedData.length > 0 ? (

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {sharedData.map ((shared,index) => (
                <div 
                key={index}
                className="bg-white rounded-lg shadow-md relative"
                >
                       <img
                    src={`http://localhost:8000/uploads/${shared.uploadData.photo}`}
                    alt={shared.uploadData.description || "Uploaded photo"}
                    className="w-full h-48 object-cover"
                    
                  />
                     <div className="p-3">
                    <p className="text-sm text-gray-700">{shared.uploadData.description}</p>
                    </div>

                </div>
            ))}
            </div>
          ) : (
            <div>
                <p>No any photos you have shared to others</p>
            </div>
          )

          }
        </div>
      </main>
    </div>
  );
};

export default SharedByYou;
