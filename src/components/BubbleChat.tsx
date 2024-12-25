import {
  setIsBlur,
  setReplyPopup,
  setSelectedMessage,
} from "@/redux/reducers/screenPropertySlice";
import { deleteMessage, getMessageById } from "@/services/conversationService";
import { convertHour } from "@/utils/utils";
import "animate.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./SocketContext";

const BubbleChat = ({
  message,
  openDropdown,
  updateConversation,
  messageDeleted,
}) => {
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteStatusForGuest, setDeleteStatusForGuest] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!openDropdown) {
      dispatch(setIsBlur(true));
      dispatch(setSelectedMessage(message));
    } else {
      dispatch(setIsBlur(false));
      dispatch(setSelectedMessage(null));
    }
  };

  const handleDeleteMessage = async () => {
    try {
      const result = await deleteMessage(message.id);
      if (result) {
        setDeleteStatus(true);
        setTimeout(() => {
          toggleDropdown();
        }, 2000);
        updateConversation(message);
        socket.emit("removeMessage", {
          message: message,
          receiverId: message?.conversation.participants.find(
            (participant) => participant.id !== currentUser.id
          ).id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplyMessage = (message: any) => {
    dispatch(setReplyPopup(message));
    toggleDropdown();
  };

  const handleGetReplyMessage = async (message: any) => {
    try {
      const result = await getMessageById(message.replyId);
      if (typeof result !== "string") {
        setReplyMessage(result);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleClickOutside = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      toggleDropdown();
    }
  };

  const downloadFile = (file) => {
    const byteCharacter = atob(file.text);
    const byteNumber = Array.from(byteCharacter, (char) => char.charCodeAt(0));
    const byteArr = new Uint8Array(byteNumber);

    const blob = new Blob([byteArr], { type: file.type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    a.click();
  };

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, []);

  useEffect(() => {
    if (messageDeleted && messageDeleted.id === message.id) {
      setDeleteStatusForGuest(true);
      setTimeout(() => {
        setDeleteStatusForGuest(false);
      }, 1950);
    }
  }, [messageDeleted]);

  useEffect(() => {
    if (deleteStatusForGuest) {
      setTimeout(() => {
        updateConversation(messageDeleted);
      }, 2000);
    }
  }, [deleteStatusForGuest]);

  useEffect(() => {
    if (message?.replyId) {
      handleGetReplyMessage(message);
    }
  }, [message]);

  return (
    <>
      <div
        className="flex items-start gap-2.5 relative mb-6"
        ref={dropdownRef}
        style={
          message?.sender.id !== currentUser.id
            ? { justifyContent: "flex-start" }
            : { justifyContent: "flex-end" }
        }
      >
        {openDropdown && message?.sender.id === currentUser.id && (
          <div
            id="dropdownDots"
            className="z-10 top-[-134px] shadow absolute divide-y rounded-lg  w-40 bg-gray-700 divide-gray-600"
          >
            <ul
              className="py-2 text-sm text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li
                className="block px-4 py-2  hover:text-white cursor-pointer"
                onClick={() => handleReplyMessage(message)}
              >
                Reply
              </li>

              <li className="block px-4 py-2  hover:text-white cursor-pointer">
                Copy
              </li>

              <li
                className="block px-4 py-2  hover:text-white cursor-pointer"
                onClick={handleDeleteMessage}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
        {message?.sender.id !== currentUser.id ? (
          <img
            className="w-8 h-8 me-3 text-gray-200 dark:text-gray-700 rounded-full"
            src={message?.sender.profilePic}
          />
        ) : (
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            data-dropdown-placement="bottom-start"
            className="inline-flex self-center items-center p-2 text-sm font-medium text-center   rounded-lg   "
            type="button"
            onClick={toggleDropdown}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        )}
        {message?.sender.id !== currentUser.id ? (
          <div className="flex flex-col gap-1 w-auto max-w-[320px]">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-normal text-gray-400">
                {convertHour(message?.updatedAt)}
              </span>
            </div>
            <div
              className={`flex flex-col w-fit leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl bg-gray-700 ${
                deleteStatusForGuest ? "animate__animated animate__hinge" : ""
              } ${openDropdown && "neon-gray"} `}
            >
              {message?.replyId && (
                <div className="reply-container bg-[#708090] ml-auto min-w-[min-content] w-full">
                  <p className="text-base font-bold text-ellipsis whitespace-nowrap">
                    {replyMessage?.sender?.name}
                  </p>
                  <p className="text-sm text-wrap">{replyMessage?.text}</p>
                </div>
              )}
              {( message?.fileType && !message?.fileType.startsWith("image/")) ? (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => downloadFile(message)}
                >
                  <div className="w-8 h-8 rounded-full bg-white align-middle justify-center flex mr-3">
                    <img
                      src="../../public/assets/icons/Folder_check.svg"
                      alt=""
                    />
                  </div>
                  <p>{message?.fileName}</p>
                </div>
              ) : (message?.fileType && message?.fileType.startsWith("image/")) ? (
                <img src={message?.text} alt="Image error" />
              ) : (
                <p className="text-sm font-normal text-white break-words">
                  {message?.text}
                </p>
              )}
            </div>
            {/* <span className="text-sm font-normal text-gray-400">Delivered</span> */}
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-auto max-w-[320px]">
            <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-normal text-gray-400">
                {convertHour(message?.updatedAt)}
              </span>
            </div>
            <div
              className={`flex flex-col leading-1.5 p-4 border-gray-200  rounded-s-xl rounded-ee-xl bg-[#3797F0]  ${
                deleteStatus ? "animate__animated animate__hinge" : ""
              } ${openDropdown && "neon-blue"} `}
              
            >
              {message?.replyId && (
                <div className="reply-container bg-[#00bfff] ml-auto min-w-[min-content] w-full">
                  <p className="text-base font-bold text-ellipsis whitespace-nowrap">
                    {replyMessage?.sender?.name}
                  </p>
                  <p className="text-sm text-wrap">{replyMessage?.text}</p>
                </div>
              )}
              {(message?.fileType && !message?.fileType.startsWith("image/")) ? (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => downloadFile(message)}
                >
                  <div className="w-8 h-8 rounded-full bg-white align-middle justify-center flex mr-3">
                    <img
                      src="../../public/assets/icons/Folder_check.svg"
                      alt=""
                    />
                  </div>
                  <p>{message?.fileName}</p>
                </div>
              ) : (message?.fileType && message?.fileType.startsWith("image/")) ? (
                <img src={message?.text} alt="Image error" />
              ) : (
                <p className="text-sm text-start break-words font-normal text-white w-full text-wrap">
                  {message?.text}
                </p>
              )}
            </div>
            {/* <span className="text-sm font-normal text-gray-400">Delivered</span> */}
          </div>
        )}

        {message?.sender.id !== currentUser.id && (
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            data-dropdown-placement="bottom-start"
            className="inline-flex self-center items-center p-2 text-sm font-medium text-center   rounded-lg   "
            type="button"
            onClick={toggleDropdown}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        )}

        {openDropdown && message?.sender.id !== currentUser.id && (
          <div
            id="dropdownDots"
            className="z-10 top-[-112px] shadow absolute divide-y rounded-lg  w-40 bg-gray-700 divide-gray-600"
          >
            <ul
              className="py-2 text-sm text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li
                className="block px-4 py-2  hover:text-white"
                onClick={() => handleReplyMessage(message)}
              >
                Reply
              </li>

              <li className="block px-4 py-2  hover:text-white">Copy</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default BubbleChat;
