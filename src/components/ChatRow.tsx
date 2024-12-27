import { timeAgo } from "@/utils/utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatRow = ({conversation, selectConversation}) => {
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);
    const participant = conversation?.participants ? conversation?.participants.filter((participant)=> participant.id !== currentUser.id) : [conversation];

    return (
        <div className="flex w-full justify-between mt-3 cursor-pointer overflow-hidden"  key={conversation && conversation.id } onClick={()=>{
            selectConversation(conversation);
        }}>
        <Link to={`/chat/${participant[0].id}`} className='flex items-center gap-3 md:w-full' >
            <img
                src={conversation && participant[0].profilePic ? participant[0].profilePic : "/assets/images/defaultImage.png"}
                alt="avatar image"
                className="rounded-full w-14 h-14"/>
            <div className="flex flex-col ml-1">
                <p className="base-medium lg:body-bold text-light-1">{conversation && participant[0].name}</p>
                {conversation.participants && (
                    <div className="flex items-center gap-2 text-[#A8A8A8]">
                    <p className="subtle-semibold lg:small-regular text-[#A8A8A8] truncate w-[30%]">{conversation?.lastMessage?.text}</p>•<p className="subtle-semibold lg:small-regular w-20 truncate ">{timeAgo(conversation.updatedAt)}</p>
                </div>
                )}
            </div>
        </Link>
    </div>
    );
  };
  
  export default ChatRow;
  