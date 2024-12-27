import { conversationActions, createMeeting } from "@/redux/reducers/conversationSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatHeader = ({ loading, userChatWith, onBack, socket, currentUser }) => {
  const {callCompStatus} = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const handleStartCall = async (id:any) => {
    const token = import.meta.env.VITE_AUTH_TOKEN_VIDEOSDK
    const meetingId = await dispatch(createMeeting(token));
    await dispatch(conversationActions.setParticipantIsCalling(userChatWith));
    
    if (meetingId?.payload) {
      socket.emit("sendMeetingId", {
        meetingId: meetingId?.payload,
        receiverId: userChatWith?.id,
        senderId: currentUser?.id
      })
    }

  }

  return (
    <div className="fixed top-18 z-10 bg-black w-full flex items-center p-4 border-b border-gray-700 md:absolute ">
      <div className="flex-1 flex items-center" onClick={onBack}>
        <img
          className="w-6 h-6 text-white cursor-pointer"
          src="/assets/icons/arrow-left.svg"
        />
        {loading ? (
          <span className="animate-pulse ml-4 text-[16px] text-lg h-3 w-40 font-semibold bg-gray-200 rounded-full dark:bg-gray-700"></span>
        ) : (
          <span className="ml-4 text-[16px] text-lg font-semibold ">
            {userChatWith?.name}
          </span>
        )}
      </div>
      <img src="/assets/icons/Phone_light.svg" alt="" className="w-7 h-7 mr-2 text-white cursor-pointer" onClick={()=>handleStartCall(userChatWith?.id)}/>
      <img
        className="w-6 h-6 text-white cursor-pointer"
        src="/assets/icons/info.svg"
      />
    </div>
  );
}

export default ChatHeader;
