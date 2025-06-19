
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";



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
  
  const [sharedData, setShareData] = useState <sharedData[]>([]);
  const [message , setMessage] = useState('');

  
    const navigate = useNavigate();

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

  const handleInsideImage =  async (id:number) => {
    console.log("button clicked")
     navigate(`photo/${id}`)
  } 

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
                        onClick={()=> handleInsideImage(shared.uploadData.id)}
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
