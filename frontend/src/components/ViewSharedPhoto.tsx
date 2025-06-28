    import React,{useEffect,useState} from "react";
    import Navbar from "./Navbar";
    import axios from "axios";
    import {  useParams } from "react-router-dom";


    interface photoData{
        description: string,
        photo: string,
        id: number,
        createdAt: string,
       user: {
            email: string;
           }    
        }

    const ViewSharedPhoto: React.FC = () => {
    
    const { id} = useParams<{id: string}>();
    const [message, setMessage] = useState<string>("");
    const [photoData,setPhotoData] = useState<photoData | null>(null);
    
    
    const [sharedGmail, setSharedGmail] = useState('');
    const [shared, setShared]  = useState(false)
    

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
            'Failed to load data.'
        );
        } 
    }
        if (id) {
        fetchPhoto();
        }
    },[id])

    if (!photoData) {
        if (message)
        {
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

    

    }

    const handleShareData = async () => {
        try{
        console.log("Payload", {
    receiverEmail: sharedGmail,
    photoId: photoData.id
    });

    console.log("type",typeof sharedGmail); // should log: number

        const res = await axios.post(
                "http://localhost:8000/api/data/share/sharePhoto",
            {
            receiverEmail: sharedGmail,
            photoId: (photoData.id) 
            },
            {withCredentials: true}

        )
        console.log(res)
        setMessage(res.data.message);
        }
    catch (err: any) {
    console.log("Error response:", err.response?.data);
    setMessage(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to share data.'
    );
    }

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
                    { formatDate (photoData.createdAt)}</p>
                </div>

                <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#E9DFCE] py-5">
                    <p className="text-[#A18249] text-sm"> Shared By</p>
                    <p className="text-[#1C160C] text-sm break-words overflow-hidden">
                    { photoData.user.email}</p>
                </div>


                </div>
            
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default ViewSharedPhoto;