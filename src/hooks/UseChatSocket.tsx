import { conversationActions } from "@/redux/reducers/conversationSlice";
import { useEffect } from "react";


export const useChatSocket = (
  socket,
  dispatch,
  currentUser,
  selectedConversation,
  setSelectedConversation,
  setMessageDeleted,
  handleRemoveMessInFront
) => {
  useEffect(() => {
    socket?.on("newMessage", (data) => {
      if (
        data?.conversation?.id ===
          selectedConversation?.messages[0]?.conversation.id ||
        selectedConversation?.messages.length === 0
      ) {
        setSelectedConversation((prevConversation) => ({
          ...prevConversation,
          messages: [...prevConversation.messages, data],
        }));
      }
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [selectedConversation, socket]);

  useEffect(() => {
    socket?.on("deleteMessage", (data) => {
      if (
        data?.conversation?.id ===
        selectedConversation?.messages[0].conversation.id
      ) {
        setMessageDeleted(data);
        // setTimeout(() => {
        //   handleRemoveMessInFront(data);
        // }, 2000)
      }
    });
    return () => {
      socket?.off("deleteMessage");
    };
  }, [socket, selectedConversation]);

  useEffect(() => {
    socket?.on("newFile", (data) => {
      if (
        data?.conversation?.id ===
          selectedConversation?.messages[0]?.conversation.id ||
        selectedConversation?.messages.length === 0
      ) {
        setSelectedConversation((prevConversation) => ({
          ...prevConversation,
          messages: [...prevConversation.messages, data],
        }));
      }
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [selectedConversation, socket]);
};
