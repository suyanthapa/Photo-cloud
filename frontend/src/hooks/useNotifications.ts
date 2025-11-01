import { io } from "socket.io-client";
import { useEffect } from "react";

export function useNotification(userId: string) {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, { query: { userId } });
    socket.on("new-notification", (notif) => {
      console.log("New notification received:", notif);
      return () => socket.disconnect();
    });
  }, [userId]);
}
