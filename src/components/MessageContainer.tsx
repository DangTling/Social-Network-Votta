import { useEffect, useState } from "react";
import BubbleChat from "./BubbleChat";
import SkeletonBubbleChat from "./ui/skeletonBubbleChat";

const MessageContainer = ({conversation, loading, messageDeleted, updateConversation}) => {
    const [messages, setMessages] = useState(conversation?.messages);

    useEffect(() => {
        setMessages(conversation?.messages);
      }, [conversation]);

    return (
        <div className=" mt-4 px-4 pb-40 w-full">
            {loading && [0,1,2,3].map((i) => <SkeletonBubbleChat key={i} idx={i}/>)}
            {!loading && messages.map((message, idx) => <BubbleChat key={idx} message={message} openDropdown={false} messageDeleted={messageDeleted} updateConversation={updateConversation} />)}
        </div>
    );
}

export default MessageContainer;