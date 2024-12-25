import {interactPost, savePost} from "@/services/postService.ts";
import {toast} from "react-toastify";

import {useEffect, useState} from "react";
import { useSelector } from "react-redux";


const PostStatus = ({post, like, count, onStatusChange}:any) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    useEffect(() => {
        setIsLiked(like)
        setLikeCount(count)
        setIsSaved(post?.savedIn?.some((user:any) => user.id === currentUser?.id))
    }, [like, count, post?.savedIn?.length]);

    const handleLikeOrDislikePost = async (postId:string, targetUserId:string) => {
        try {
            const result = await interactPost(postId, targetUserId);
            if (typeof result === "string") {
                setIsLiked(!isLiked)
                setLikeCount((prevCount:number) => (isLiked ? prevCount - 1 : prevCount + 1))
                if (onStatusChange) {
                    onStatusChange();
                }
            }
        } catch (error) {
            console.error('Error interacting with post:', error);
            toast.error('Error interacting with post');
        }
    }

    const handleClick = () => {
        handleLikeOrDislikePost(post.id, post.postedBy?.id)
    }

    const handleSave = () => {
        savePost(post.id);
        setIsSaved(!isSaved)
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5" onClick={handleClick}>
                <img src={isLiked ? "../../public/assets/icons/liked.svg" : "../../public/assets/icons/like.svg"} alt="Like icon" width={20} height={20}/>
                <p className="small-medium lg:base-medium">{likeCount}</p>
            </div>
            <div className="flex gap-1" onClick={handleSave}>
                <img src={isSaved ? "../../public/assets/icons/saved.svg" : "../../public/assets/icons/save.svg"} alt="Save icon" width={20} height={20}/>
            </div>
        </div>
    );
};

export default PostStatus;