import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import PostStatus from "@/components/PostStatus.tsx";
import { useEffect, useState } from "react";
import {
  commentPost,
  deletePost,
  getPostDetail,
  interactPost,
} from "@/services/postService.ts";
import { RingLoader } from "react-spinners";
import Lottie from "react-lottie";
import { toast } from "react-toastify";
import newLove from "@/assets/lotties/new-heart.json";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import UserChatRow from "@/components/Comment";
import { createNotification } from "@/redux/reducers/notificationSlice";
import { useSocket } from "@/components/SocketContext";
import { useCommentSocket } from "@/hooks/UseCommentSocket";

const PostDetailScreen = () => {
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const targetName: string = param["*"] ? param["*"] : "";
  const [postId, targetUserId] = targetName.split("/");
  const [post, setPost] = useState<any>(null);
  const [postDate, setPostDate] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [count, setCount] = useState(0);

  const option = {
    animationData: newLove,
    loop: true,
  };

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

  const handleChange = (event: any) => {
    const textareaLineHeight = 20;
    const previousRows = event.target.rows;
    const currentRows = Math.ceil(
      event.target.scrollHeight / (2 * textareaLineHeight)
    );

    if (currentRows !== previousRows) {
      setRows(currentRows);
    }
    setText(event.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (text.trim() !== "") {
      try {
        const result = await commentPost(postId, targetUserId, { text: text });
        if (result) {
          toast.success("Have commented successfully");
          setText("");
          setRows(1);

          if (currentUser.id !== post?.postedBy?.id) {
            await dispatch(
              createNotification({
                ...request,
                ownerId: post?.postedBy?.id,
                postId: post?.id,
                postPic: post?.postPic,
                content: `${currentUser?.name} commented your post`,
              })
            );

            socket?.emit("sendNotify", {
              receiverId: post?.postedBy?.id,
              senderId: currentUser?.id,
              message: `${currentUser?.name} commented your post`,
            });
          }
        }
        socket?.emit("sendComment", {
          receiverIds: [
            ...post?.postedBy?.follower,
            ...post?.postedBy?.following,
            post?.postedBy?.id,
          ],
          senderId: currentUser?.id,
        });

        getInfoPost();
      } catch (error) {
        console.error("Error interacting with post:", error);
        toast.error("Error interacting with post");
      }
    }
  };

  const generateComment = (replies: any, startIndex: number, count: number) => {
    return replies
      .slice(startIndex, startIndex + count)
      .map((reply: any) => <UserChatRow key={reply.id} reply={reply} />);
  };

  const handleDeletePost = async () => {
    try {
      const result = await deletePost(postId, post?.postedBy?.id);
      if (result === "Successfully deleted post") {
        toast.success(result);
        navigate(-1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInfoPost = async () => {
    const result = await getPostDetail(targetUserId, postId);
    setPost(result);
    setLikeCount(result.like?.length);
    setIsLiked(result.like?.some((user: any) => user.id === currentUser.id));
    const { createdAt } = result;
    setPostDate(new Date(createdAt).toLocaleDateString());
  };

  useCommentSocket(socket, dispatch, currentUser, getInfoPost);

  useEffect(() => {
    getInfoPost();
  }, [postId, targetUserId, count]);

  useEffect(() => {
    if (text === "") {
      setRows(1);
    }
  }, [text]);

  const onStatusChange = () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount: number) =>
      isLiked ? prevCount - 1 : prevCount + 1
    );
  };

  const handleDoubleClick = () => {
    setShowAnimation(true);
    if (!isLiked) {
      const handleLikePost = async () => {
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

      handleLikePost();
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
    <div className="post_details-container flex w-full  justify-center xl:overflow-y-hidden md:h-auto h-[82vh]">
      <div className="post_details-card flex h-[100%] md:overflow-x-hidden custom-scrollbar relative">
        <div className=" md:flex max-w-5xl w-full absolute z-10 overflow-x-hidden">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="shad-button_ghost"
          >
            <img
              src="/assets/icons/Reply.svg"
              alt="back"
              width={28}
              height={28}
            />
            <p className="text-primary-500 small-semibold lg:base-semibold">
              Back
            </p>
          </Button>
        </div>
        {!post?.postPic && (
          <RingLoader
            color={"#877EFF"}
            loading={true}
            size={200}
            className=" z-10 mt-[30%] ml-[24%]"
          />
        )}
        <div
          className="post-image-container md:w-[60%]"
          onDoubleClick={handleDoubleClick}
        >
          {post?.postPic &&
          post?.postPic.split(".").pop().toLowerCase() === "mp4" ? (
            <video
              src={post?.postPic}
              autoPlay
              loop
              controls
              className="post_details-img"
            ></video>
          ) : (
            <img
              src={
                post?.postPic
                  ? post?.postPic
                  : "/assets/images/logo-no-background.svg"
              }
              alt="post detail iamge"
              className="post_details-img"
              style={
                post?.postPic
                  ? {}
                  : { filter: "blur(5px)", width: "100%", overflow: "hidden" }
              }
            />
          )}
          {showAnimation && (
            <div className="animation-overlay">
              <Lottie options={option} />
            </div>
          )}
        </div>
        <div className="post_details-info relative">
          <div className="flex w-full justify-between">
            <Link to="/profile" className="flex items-center gap-3">
              <img
                src={
                  post?.postedBy?.profilePic
                    ? post?.postedBy?.profilePic
                    : "/assets/images/logo-no-background.svg"
                }
                alt="avatar image"
                className="rounded-full w-8 h-8 lg:h-12 lg:w-12 overflow-hidden"
              />
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post?.postedBy?.username}
                </p>
                <div className="flex gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular">{postDate}</p>
                  <p className="subtle-semibold lg:small-regular">Hanoi</p>
                </div>
              </div>
            </Link>
            <div className="flex-center gap-1">
              <Link to={`/edit-post/${postId}`}>
                <img
                  src="/assets/icons/edit.svg"
                  alt="edit icon"
                  width={24}
                  height={24}
                />
              </Link>
              <Button
                variant="ghost"
                className="post_details-delete_btn"
                onClick={handleDeletePost}
              >
                <img
                  src="/assets/icons/delete.svg"
                  alt="delete icon"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </div>
          <hr className="border w-full border-dark-4/80" />
          <section className="overflow-y-auto custom-scrollbar xl:mb-[30%]">
            <div className="flex flex-col  w-full small-medium lg:base-regular ">
              <p className="whitespace-pre-line">{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.split(",").map((tag: string, index: number) => (
                  <li className="text-light-3" key={index}>
                    #{tag.trim()}
                  </li>
                ))}
              </ul>
            </div>

            {post?.replies?.length > 0 && (
              <div className=" w-full ">
                {post?.replies?.length <= 15
                  ? generateComment(post?.replies, 0, post?.replies?.length)
                  : generateComment(post?.replies, 0, count + 15)}
                {post?.replies?.length > count + 15 && (
                  <p
                    className="text-[#A8A8A8] mt-3 cursor-pointer"
                    onClick={() => setCount((prev) => prev + 15)}
                  >
                    Load more comments
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="xl:w-[80%] w-full pt-2 xl:absolute bottom-5 border-t-primary-500 border-t-2">
            <PostStatus
              post={post}
              like={isLiked}
              count={likeCount}
              onStatusChange={onStatusChange}
            />
            <section>
              <form
                action=""
                method=""
                className="flex w-[100%] justify-between mt-2"
              >
                <textarea
                  name=""
                  id=""
                  className="rounded-xl w-[80%] mr-1 bg-dark-4 outline-none px-3 py-2 custom-scrollbar"
                  placeholder="Add a comment"
                  rows={rows}
                  value={text}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleSubmit(e);
                    }
                  }}
                ></textarea>
                <button type="button" onClick={handleSubmit}>
                  <img
                    src="/assets/icons/send.svg"
                    alt="Send Icon"
                    width={20}
                    height={20}
                  />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailScreen;
