import axios from "axios";

export const fetchImages = async (page: number, limit: number) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const res = await axios.get(
    `${apiBaseUrl}/api/data/images?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return res.data;
};
