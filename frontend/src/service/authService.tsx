import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

export const logout = async () => {
  try {
    await axios.post(
      `${apiBaseUrl}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to logout.",
    };
  }
};
