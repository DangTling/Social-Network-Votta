import { getAllNotification, notificationActions } from "@/redux/reducers/notificationSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useNotificationSocket = (
  socket,
  dispatch,
  currentUser
) => {
  useEffect(() => {
    socket?.on("newNotify", (data) => {
      if (data?.receiverId === currentUser?.id) {
        dispatch(notificationActions.setListNotiff([]))
        dispatch(getAllNotification({currentUserId: currentUser?.id, page: 0, size: 5}));
        toast.info(data?.message);
      }
    })
    return () => {
      socket?.off("newNotify");
    }
  }, [socket, dispatch]);
};
