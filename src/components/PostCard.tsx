import { Link } from "react-router-dom";
import PostStatus from "@/components/PostStatus.tsx";
import { useState } from "react";
import Lottie from "react-lottie";
import love from "@/assets/lotties/new-heart.json";
import { useDispatch, useSelector } from "react-redux";
import { interactPost } from "@/services/postService.ts";
import { toast } from "react-toastify";
import { useSocket } from "./SocketContext";
import { createNotification } from "@/redux/reducers/notificationSlice";


const PostCard = ({ post, pending, confirmPost }: any) => {
  const { createdAt } = post;
  const postDate = new Date(createdAt).toLocaleDateString();
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const [isLiked, setIsLiked] = useState(
    post.like.some((user: any) => user.id === currentUser?.id)
  );
  const [likedCount, setLikedCount] = useState(post.like.length);
  const [showAnimation, setShowAnimation] = useState(false);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  const request = {
    ownerId: null,
    content: null,
    affectedUserId: currentUser?.id,
    affectedUserPic: currentUser?.profilePic,
    affectedName: currentUser?.name,
    affectedUsername: currentUser?.username,
    postPic: null,
    postId: null,
  };

  const option = {
    animationData: love,
    loop: true,
  };

  const onStatusChange = () => {
    setIsLiked(!isLiked);
    setLikedCount((prevCount: number) =>
      isLiked ? prevCount - 1 : prevCount + 1
    );
  };

  const handleDoubleClick = () => {
    setShowAnimation(true);
    if (!isLiked) {
      const handleLikePost = async (postId: string, targetUserId: string) => {
        try {
          const result = await interactPost(postId, targetUserId);
          if (typeof result === "string") {
            onStatusChange();

            await dispatch(
              createNotification({
                    ...request,
                    ownerId: post?.postedBy?.id,
                    postId: post?.id,
                    postPic: post?.postPic,
                    content: `${currentUser?.name} liked your post`,
                })
            );

            socket?.emit("sendNotify", {
              receiverId: post?.postedBy?.id,
              senderId: currentUser?.id,
              message: `${currentUser?.name} liked your post`,
            });
          }
        } catch (error) {
          console.error("Error interacting with post:", error);
          toast.error("Error interacting with post");
        }
      };

      handleLikePost(post.id, post.postedBy.id);
    }
    setTimeout(() => {
      const overlay = document.querySelector(".animation-overlay");
      if (overlay) {
        overlay.classList.add("fade-out");
      }
      setTimeout(() => {
        setShowAnimation(false);
      }, 300);
    }, 2000);
  };

  return (
    <div className="post-card relative">
      {pending && (
        <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 absolute top-[-1rem] right-2" onClick={()=>confirmPost({postId: post?.id})}>confirm</button>
      )}
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.postedBy?.username}`}>
            <img
              src={
                post?.postedBy?.profilePic
                  ? post?.postedBy?.profilePic
                  : "/assets/images/logo-no-background.svg"
              }
              alt="avatar user"
              loading="lazy"
              className="rounded-full w-12 h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.postedBy?.username}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{postDate}</p>•
              <p className="subtle-semibold lg:small-regular">Hanoi</p>
            </div>
          </div>
        </div>
        
        <Link to={`/edit-post/${post?.id}`}>
          <img
            src="/assets/icons/edit.svg"
            alt="Edit icons"
            width={20}
            height={20}
            loading="lazy"
          />
        </Link>
      </div>
      <Link to={`/posts/${post?.id}/${post?.postedBy?.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="whitespace-pre-line">{post?.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags?.split(",").map((tag: string, index: number) => (
              <li className="text-light-3" key={index}>#{tag.trim()}</li>
            ))}
          </ul>
        </div>
      </Link>
      <div className="post-image-container" onDoubleClick={handleDoubleClick}>
        {post?.postPic.split(".").pop().toLowerCase() === "mp4" ? (
          <video src={post?.postPic} autoPlay loop controls className="post-card_img" />
        ): (

        <img
          src={
            post?.postPic
              ? post?.postPic
              : "/assets/images/logo-no-background.svg"
          }
          alt="post image"
          loading="lazy"
          className="post-card_img"
        />
        )}
        {showAnimation && (
          <div className="animation-overlay">
            <Lottie options={option} />
          </div>
        )}
      </div>
      <PostStatus
        post={post}
        like={isLiked}
        count={likedCount}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default PostCard;
