import { timeAgo } from "@/utils/utils";
import { Link } from "react-router-dom";

const Comment = ({reply}) => {
    return (
        <div className="flex w-full justify-between mt-3"  key={reply && reply.id }>
                <Link to='/profile' className='flex items-center gap-3'>
                    <img
                        src={reply && reply?.userProfilePic }
                        alt="avatar image"
                        className="rounded-full w-8 h-8 lg:h-12 lg:w-12"/>
                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">{reply && reply?.username}</p>
                        <div className="flex gap-2">
                            <p className="subtle-semibold lg:small-regular text-[#A8A8A8]">{reply && reply?.text} • {timeAgo(reply?.createdAt)}</p>
                        </div>
                    </div>
                </Link>
            </div>
    );
}

export default Comment;