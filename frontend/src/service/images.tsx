import axios from "axios";

export const fetchImages = async (page: number, limit: number) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const res = await axios.get(
    `${apiBaseUrl}/api/data/images?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );

  if (res.data.success) {
    return res.data.data; // Return the actual data object with images, currentPage, totalPages
  } else {
    throw new Error(res.data.message || "Failed to fetch images");
  }
};
