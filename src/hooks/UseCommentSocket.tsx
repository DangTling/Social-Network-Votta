import { useEffect } from "react";

export const useCommentSocket = (
  socket,
  dispatch,
  currentUser, 
  getInfoPost
) => {
  useEffect(() => {
    socket?.on("newComment", (data) => {
      if (data?.receiverIds.includes(currentUser?.id)) {
        getInfoPost()
      }
    })
    return () => {
      socket?.off("newComment");
    }
  }, [socket, dispatch]);
};
