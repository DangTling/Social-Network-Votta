import BubbleChat from "@/components/BubbleChat";
import MessageContainer from "@/components/MessageContainer";
import {
  setIsBlur,
  setReplyPopup,
  setSelectedMessage,
} from "@/redux/reducers/screenPropertySlice";
import { getConversation, sendMessage } from "@/services/conversationService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../components/SocketContext";
import Swal from "sweetalert2";
import { findUserById } from "@/services/userService";
import ChatHeader from "@/components/ChatHeader";
import ChatFooter from "@/components/ChatFooter";
import { useChatSocket } from "@/hooks/UseChatSocket";
import { conversationActions } from "@/redux/reducers/conversationSlice";
import uploadWidget from "@/utils/uploadWidget";
import CallComponent from "@/components/CallComponent";

const ChatDetailScreen = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const { isBlur, replyPopup } = useSelector(
    (state: any) => state.screenProperty
  );
  const selectedMessage = useSelector(
    (state: any) => state.screenProperty.selectedMessage
  );

  const { socket } = useSocket();

  const [userChatWith, setUserChatWith] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageDeleted, setMessageDeleted] = useState(null);

  const handleSendMessage = (e) => {
    if (e?.preventDefault) {
      e.preventDefault(); 
    }

    if (inputValue.trim() !== "" && userChatWith?.id) {
      (async () => {
        const result = await sendMessage({
          message: inputValue,
          receiverId: userChatWith?.id,
          replyId: replyPopup !== null ? replyPopup?.id : null,
        });
        if (result?.conversation) {
          setInputValue("");
          dispatch(setReplyPopup(null));
          if (
            result?.conversation?.id ===
              selectedConversation?.messages[0]?.conversation.id ||
            selectedConversation?.messages.length === 0
          ) {
            setSelectedConversation((prevConversation) => ({
              ...prevConversation,
              messages: [...prevConversation.messages, result],
            }));
          }
          socket.emit("sendMessage", {
            message: result,
            receiverId: userChatWith?.id,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: result,
            text: "Please back!",
          }).then(() => {
            window.history.back();
          });
        }
      })();
    }
  };
  const handleRemoveMessInFront = (message) => {
    setSelectedConversation((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== message.id),
    }));
  };
  const handleSendFile = (file) => {
    if (file && userChatWith?.id) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = async () => {
        let contentFile;
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          contentFile = await uploadWidget(file);
        } else {
          contentFile = reader.result.split(",")[1];
        }
        const result = await sendMessage({
          message: contentFile,
          fileName: file.name,
          fileType: file.type,
          receiverId: userChatWith?.id,
          replyId: replyPopup !== null ? replyPopup?.id : null,
        });
        if (result?.conversation) {
          dispatch(setReplyPopup(null));
          if (
            result?.conversation?.id ===
              selectedConversation?.messages[0]?.conversation.id ||
            selectedConversation?.messages.length === 0
          ) {
            setSelectedConversation((prevConversation) => ({
              ...prevConversation,
              messages: [...prevConversation.messages, result],
            }));
          }
          socket.emit("sendFile", {
            message: result,
            receiverId: userChatWith?.id,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: result,
            text: "Please back!",
          }).then(() => {
            window.history.back();
          });
        }
      };
    }
  };

  useChatSocket(
    socket,
    dispatch,
    currentUser,
    selectedConversation,
    setSelectedConversation,
    setMessageDeleted,
    handleRemoveMessInFront
  );

  useEffect(() => {
    const messageContainer = document.querySelector(".message-container");
    setTimeout(() => {
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 100);
  }, [selectedConversation]);

  useEffect(() => {
    setLoading(true);
    dispatch(setIsBlur(false));
    dispatch(setSelectedMessage(null));
    (async () => {
      const result = await getConversation(params["*"]);
      const userChatWith = await findUserById(params["*"]);
      if (result?.messages) {
        setSelectedConversation(result);
        setUserChatWith(userChatWith);
        setLoading(false);
      }
    })();
  }, [params["*"]]);

  return (
    <div className="flex flex-1 overflow-x-hidden md:h-full md:overflow-y-hidden relative h-[100vh] overflow-y-scroll">
      <div className="chat-container md:relative h-full">
        <ChatHeader
          loading={loading}
          userChatWith={userChatWith}
          onBack={() => {
            dispatch(conversationActions.clearSelectedConversation());
            navigate("/chat");
          }}
          socket={socket}
          currentUser={currentUser}
        />

        {loading && (
          <div className="mt-20 height-[66vh] overflow-y-scroll custom-scrollbar w-full">
            <div className="flex flex-col items-center">
              <svg
                className="animate-pulse dark:bg-gray-700 w-14 h-14 me-3 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>

              <h1 className="mt-4 text-xl font-bold animate-pulse h-3 w-44 font-semibold bg-gray-200 rounded-full dark:bg-gray-700"></h1>

              <p className="mt-1 text-gray-400 animate-pulse h-3 w-36 font-semibold bg-gray-200 rounded-full dark:bg-gray-700"></p>
              <button className="mt-4 bg-gray-700 px-4 py-2 rounded-full">
                View profile
              </button>
            </div>
            <MessageContainer
              conversation={selectedConversation}
              loading={loading}
            />
          </div>
        )}

        {!loading && (
          <div
            className={`message-container custom-scrollbar mt-20 mb-24 height-[66vh] overflow-y-scroll w-full`}
            style={isBlur ? { filter: "blur(10px)" } : {}}
          >
            <div className="flex flex-col items-center ">
              <img
                className=" w-14 h-14 me-3 text-gray-200 rounded-full  dark:text-gray-700"
                src={userChatWith?.profilePic}
              />

              <h1 className="mt-4 text-xl font-bold ">{userChatWith?.name}</h1>

              <p className="text-gray-400 ">@{userChatWith?.username}</p>
              <button className="mt-4 bg-gray-700 px-4 py-2 rounded-full">
                View profile
              </button>
            </div>
            <MessageContainer
              conversation={selectedConversation}
              loading={loading}
              messageDeleted={messageDeleted}
              updateConversation={handleRemoveMessInFront}
              setMessageDeleted={setMessageDeleted}
            />
          </div>
        )}

        <ChatFooter
          handleSendMessage={handleSendMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendFile={handleSendFile}
        />
      </div>

      {selectedMessage && (
        <div
          className="overlay top-0 h-[100vh] md:items-end px-4 items-center md:h-[69vh]"
          style={
            selectedMessage.sender.id !== currentUser.id
              ? { justifyContent: "flex-start" }
              : { justifyContent: "flex-end" }
          }
        >
          <div className="popup">
            <BubbleChat
              message={selectedMessage}
              openDropdown={true}
              updateConversation={handleRemoveMessInFront}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetailScreen;
