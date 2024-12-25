import { setReplyPopup } from "@/redux/reducers/screenPropertySlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

const ChatFooter = ({
  handleSendMessage,
  inputValue,
  setInputValue,
  handleSendFile,
}) => {
  const { replyPopup } = useSelector((state) => state.screenProperty);
  const [openEmoji, setOpenEmoji] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (replyPopup !== null && inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      {replyPopup !== null && (
        <div className="mt-auto fixed z-10 bottom-32 bg-black w-full p-4 pt-2 border-t border-gray-700 flex justify-between md:absolute md:bottom-12">
          <div className="w-[80%]">
            <span className="text-white text-[14px]">
              Replying to
              <span className="ml-2 text-[15px] font-bold text-yellow-300">
                {replyPopup?.sender.name}
              </span>
            </span>
            <p className="text-[#b0b3b8] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {replyPopup?.text}
            </p>
          </div>
          <div className="align-middle flex rounded-full">
            <img
              src="../../public/assets/icons/Close_round_duotone.svg"
              alt=""
              className="object-fill cursor-pointer scale-125"
              onClick={() => dispatch(setReplyPopup(null))}
            />
          </div>
        </div>
      )}
      <div className="mt-auto fixed z-10 bottom-20 bg-black w-full p-4 flex items-center border-t border-gray-700 md:absolute md:bottom-0">
        <form className="w-full" onSubmit={handleSendMessage} method="post">
          <input
            type="text"
            placeholder="Message..."
            className="bg-transparent w-full text-white outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
          />
        </form>
        <div className="flex items-center mr-4">
          <div className="relative cursor-pointer w-6 h-6">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                handleSendFile(file);
              }}
            />
            <img
              src="../../public/assets/icons/image-send.svg"
              alt="Send"
              className="w-6 h-6"
            />
          </div>
          <div
            className="relative cursor-pointer w-6 h-6"
            onClick={() => setOpenEmoji(!openEmoji)}
          >
            <img
              src="../../public/assets/icons/like.svg"
              className="w-6 h-6 text-white cursor-pointer ml-4"
            />
          </div>
        </div>
      </div>
      <div className="fixed z-10 bottom-36 md:bottom-[9rem] ">
      <EmojiPicker
        open={openEmoji}
        className=""
        height={350}
        onEmojiClick={(e)=>setInputValue((prev)=>prev+e.emoji)}
      />
      </div>
    </>
  );
};
export default ChatFooter;
