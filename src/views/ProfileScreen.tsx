import StatusBlock from "@/components/StatusBlock.tsx";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import GridPostList from "@/components/GridPostList.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  acceptFollowRequest,
  checkSessionLogin,
  denyFollowRequest,
  findUserByName,
  removeFollower,
  sendFollowRequest,
  unFollow,
} from "@/services/userService.ts";
import { RingLoader } from "react-spinners";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "react-toastify";
import { seeAllPostOfUser } from "@/services/postService.ts";
import lockIcon from "@/assets/lotties/lock-icon.json";
import Lottie from "react-lottie";
import { useSocket } from "@/components/SocketContext";
import { createNotification } from "@/redux/reducers/notificationSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const param = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const targetName: string = param["*"] ? param["*"] : "";
  const [userFound, setUserFound] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [follow, setFolow] = useState("Follow");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const updatedUser = useSelector(
    (state: any) => state.user.updateProfile.currentUser
  );

  const option = {
    animationData: lockIcon,
    loop: true,
  };

  const request = {
    ownerId: userFound?.id,
    content: null,
    affectedUserId: currentUser?.id,
    affectedUserPic: currentUser?.profilePic,
    affectedName: currentUser?.name,
    affectedUsername: currentUser?.username,
    postPic: null,
    postId: null,
  };

  const handleCheckUser = async () => {
    if (targetName === "") {
      return currentUser;
    }
    const usersFound = await findUserByName(targetName, dispatch);
    return usersFound[0];
  };

  const handleSendFollow = async () => {
    if (follow!=="Follow") {
      return;
    } else {
      const result = await sendFollowRequest(userFound?.id, currentUser?.id);
      if (typeof result === "string") {
        await dispatch(
          createNotification({
            ...request,
            content: `${currentUser.name} has sent a follow request to you`,
          })
        );
        toast.success(result);
        socket.emit("sendNotify", {
          receiverId: userFound?.id,
          senderId: currentUser?.id,
          message: `${currentUser.name} has sent a follow request to you`,
        });
      } else {
        toast.error(result.message);
      }
      setFolow("Have sent request");
    }
  };

  const handleAcceptReq = async () => {
    const result = await acceptFollowRequest(userFound?.id, currentUser?.id);
    if (typeof result === "string") {
      await dispatch(
        createNotification({
          ...request,
          content: `${currentUser.name} has accepted your follow request`,
        })
      );
      toast.success(result);
      socket.emit("sendNotify", {
        receiverId: userFound?.id,
        senderId: currentUser?.id,
        message: `${currentUser.name} has accepted your follow request`,
      });
    } else {
      toast.error(result.message);
    }
    setRefresh(!refresh);
  };

  const handleDenyReq = async () => {
    const result = await denyFollowRequest(userFound?.id, currentUser?.id);
    if (typeof result === "string") {
      toast.success(result);
    } else {
      toast.error(result.message);
    }
    setRefresh(!refresh);
  };

  const handleUnfollow = async () => {
    const result = await unFollow(userFound?.id, currentUser?.id);
    if (typeof result === "string") {
      toast.success(result);
    } else {
      toast.error(result.message);
    }
    setRefresh(!refresh);
  };

  const handleRemoveFollower = async () => {
    const result = await removeFollower(userFound?.id, currentUser?.id);
    if (typeof result === "string") {
      toast.success(result);
    } else {
      toast.error(result.message);
    }
    setRefresh(!refresh);
  };

  const handleGetLengthPost = async (id: any) => {
    try {
      const result = await seeAllPostOfUser(id);
      if (result.length === 0) {
        return -1;
      }
      return result.length;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!navigator.onLine) {
      navigate("/loss-connection");
    }
  }, [param]);

  useEffect(() => {
    checkSessionLogin(dispatch)
      .then((response) => {
        if (response.name) {
          console.log("Profile screen has been refreshed");
        }
      })
      .catch((error) => {
        console.error("Error checking session login:", error);
      });
    const fetchUser = async () => {
      const result = await handleCheckUser();
      setUserFound(result);
      setIsCurrentUser(result.username === currentUser.username);
      const count = await handleGetLengthPost(result.id);
      setPostsCount(count);
    };
    fetchUser();
  }, [dispatch, updatedUser, param, refresh]);

  if (!userFound) {
    return (
      <div className="flex w-full mx-[30%] items-center">
        <RingLoader color={"#877EFF"} loading={true} size={200} />
      </div>
    );
  }

  return (
    <div className="profile-container h-[100vh] overflow-y-scroll md:h-auto">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              userFound?.profilePic
                ? userFound?.profilePic
                : "/assets/images/defaultImage.png"
            }
            alt="Avatar"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full ">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {userFound.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{userFound.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {postsCount === -1 &&
              !isCurrentUser &&
              !currentUser?.following?.includes(userFound.id) &&
              !currentUser?.follower?.includes(userFound.id) ? (
                <p className="text-red">
                  You need to follow this user before you want to see details
                  about them!
                </p>
              ) : (
                <>
                  <StatusBlock
                    value={postsCount === -1 ? 0 : postsCount}
                    label={"Posts"}
                  />
                  <StatusBlock
                    value={userFound?.follower?.length || 0}
                    label={"Followers"}
                  />
                </>
              )}
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {userFound.bio ? userFound.bio : "👻👻👻"}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {isCurrentUser ? (
              <div>
                <Link
                  to="/update-profile"
                  className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg "
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="Edit icon"
                    width={20}
                    height={20}
                  />
                  <p className="flex whitespace-nowrap small-medium">
                    Edit profile
                  </p>
                </Link>
              </div>
            ) : currentUser?.following.includes(userFound.id) ? (
              <Button
                type="button"
                onClick={handleUnfollow}
                className="shad-button_primary px-8"
              >
                Unfollow
              </Button>
            ) : currentUser?.follower.includes(userFound.id) ? (
              <Button
                type="button"
                onClick={handleRemoveFollower}
                className="shad-button_primary px-8"
              >
                Remove following
              </Button>
            ) : currentUser?.followRequests.includes(userFound.id) ? (
              <>
                <Button
                  type="button"
                  onClick={handleAcceptReq}
                  className="shad-button_primary px-8 mr-2"
                >
                  Accept follow request
                </Button>
                <Button
                  type="button"
                  onClick={handleDenyReq}
                  className="shad-button_primary px-8"
                >
                  Deny follow request
                </Button>
              </>
            ) : userFound?.followRequests.includes(currentUser.id) ? (
              <Button
                type="button"
                className={`shad-button_primary px-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none`}
              >
                Have sent request
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSendFollow}
                className={`shad-button_primary px-8 ${
                  follow === "Have sent request" &&
                  "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                }`}
              >
                {follow}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex max-w-5xl w-full">
        <Link to="/profile" className="profile-tab rounded-l-lg bg-dark-3">
          <img
            src="/assets/icons/posts.svg"
            alt="Post icon"
            width={20}
            height={20}
          />
          Posts
        </Link>
        <Link to="/profile" className="profile-tab rounded-r-lg bg-dark-3">
          <img
            src="/assets/icons/liked.svg"
            alt="Liked icon"
            width={20}
            height={20}
          />
          Liked posts
        </Link>
      </div>
      {postsCount === -1 &&
      !isCurrentUser &&
      !currentUser?.following?.includes(userFound.id) &&
      !currentUser?.follower?.includes(userFound.id) ? (
        <div className="flex justify-center items-center">
          <Lottie options={option} />
        </div>
      ) : (
        <GridPostList userId={userFound.id} />
      )}

      <Outlet />
    </div>
  );
};

export default ProfileScreen;
