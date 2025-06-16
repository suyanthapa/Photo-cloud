import React,{useEffect,useState} from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

 interface photoData{
    description: string,
    photo: string,
    id: number,
    createdAt: string
   }


const InsideImage: React.FC = () => {
   
  const { id} = useParams<{id: string}>();
  const [message, setMessage] = useState();
  const [photoData,setPhotoData] = useState<photoData | null>(null);

  useEffect(()=>{

    const fetchPhoto = async () =>{
      try{
        console.log("response vanda mathi")
        const res = await axios.get(
          `http://localhost:8000/api/data/viewSingleData/${id}`,
           {
          withCredentials: true,
            }
        );
        console.log("response data is", res)
        setPhotoData(res.data.data);

      }
      catch (err: any) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Deletion failed.'
      );
    }     }

     if (id) {
      fetchPhoto();
    }
  },[id])

  if (!photoData) {
    return <div className="text-center py-10">Loading...</div>;
  }


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
              src={`http://localhost:8000/uploads/${photoData.photo}`}
              alt="Uploaded"
              className="max-w-[500px] w-full max-h-[400px] rounded-md object-contain"
            />
          </div>


          </div>
          <div className="flex w-[360px] flex-col">
            <div className="grid grid-cols-[20%_1fr] gap-x-6 p-4">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm">Description</p>
                <p className="text-[#1C160C] text-sm">
                   {photoData.description}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                <p className="text-[#A18249] text-sm"> Date</p>
                <p className="text-[#1C160C] text-sm"> {photoData.createdAt}</p>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,_1fr))] gap-2 px-4">
              {[
                {
                  label: 'Share on Facebook',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Share on Twitter',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M247.39,68.94A8,8,0,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Share on Instagram',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,80a48,48,0,1,0...Z" />
                    </svg>
                  ),
                },
                {
                  label: 'Copy Link',
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M137.54,186.36a8,8,0,0...Z" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 bg-white py-2.5 text-center"
                >
                  <div className="rounded-full bg-[#F4EFE6] p-2.5 text-[#1C160C]">
                    {item.icon}
                  </div>
                  <p className="text-[#1C160C] text-sm font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsideImage;
