import { conversationActions } from "@/redux/reducers/conversationSlice";
import { createNotification } from "@/redux/reducers/notificationSlice";
import { findUserById } from "@/services/userService";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useCallSocket = (socket, dispatch, currentUser, callStatus) => {
  useEffect(() => {
    socket?.on("newMeeting", async (data) => {
      if (data?.receiverId === currentUser?.id && callStatus === null) {
        await dispatch(conversationActions.setCallStatus(data));
        const user = await findUserById(data?.senderId);
        if (user) {
          await dispatch(conversationActions.setParticipantIsCalling(user));
        }
      }
      if (data?.receiverId === currentUser?.id && callStatus !== null) {
        await socket.emit("User is in a meeting", {
          senderId: currentUser?.id,
          receiverId: data?.senderId,
          meetingId: null,
        });
      }
    });
    return () => {
      socket?.off("newMeeting");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("notOnline", (data) => {
      if (data?.senderId === currentUser?.id) {
        dispatch(conversationActions.setJoin("leaved"));
        toast.error("This user is not online, please try next time");
        dispatch(
          createNotification({
            ownerId: data.receiverId,
            content: `${currentUser?.name} have missed call for you`,
            affectedUserId: data.senderId,
            affectedUserPic: currentUser.profilePic,
            affectedName: currentUser.name,
            affectedUsername: currentUser.username,
            postPic: null,
            postId: null,
          })
        );
      }
    });
    return () => {
      socket?.off("notOnline");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("canceledMeeting", (data) => {
      if (data?.receiverId === currentUser?.id) {
        dispatch(conversationActions.setMeetingId(null));
        dispatch(conversationActions.setParticipantIsCalling(null));
      }
    });
    return () => {
      socket?.off("canceledMeeting");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("busyMeeting", (data) => {
      if (data?.receiverId === currentUser?.id) {
        dispatch(conversationActions.setMeetingId(null));
        dispatch(conversationActions.setParticipantIsCalling(null));
        toast.error("This user is in a meeting");
      }
    });
    return () => {
      socket?.off("busyMeeting");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("leavedMeeting", (data) => {
      if (data?.receiverId === currentUser?.id) {
        dispatch(conversationActions.setJoin("leaved"));
      }
    });
    return () => {
      socket?.off("leavedMeeting");
    };
  }, [socket, dispatch]);
};
