import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { interactJoinRequest } from "@/services/communityService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmPosts, getPendingPosts } from "@/redux/reducers/communitySlice";
import InfiniteScroll from "./InfinitveScroll";
import { SyncLoader } from "react-spinners";
import PostStatus from "./PostStatus";
import PostCard from "./PostCard";

const UserList = (props: any) => {
  const dispatch = useDispatch();
  const { pendingPosts, totalSize, loading } = useSelector(
    (state: any) => state.community
  );
  const [page, setPage] = useState(0);

  const handleAcceptReq = async (memberId: string, type: string) => {
    try {
      const result = await interactJoinRequest(
        props?.community?.id,
        memberId,
        type
      );
      if (typeof result === "string") {
        toast.success(result);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const confirmPost = async (postId: string) => {
    dispatch(confirmPosts(postId))
    dispatch(
      getPendingPosts({
        communityId: props?.community?.id,
        page: 0,
      })
    );
    toast.success("Post confirmed successfully");
  }

  useEffect(() => {
    dispatch(
      getPendingPosts({
        communityId: props?.community?.id,
        page: page,
      })
    );
  }, [page]);

  return (
    <section className="xl:w-[70%] 2xl:w-[60%] w-full mb-[20%] md:mb-0">
      <div className="w-full rounded-xl border-2 border-light-4 overflow-hidden">
        <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4 ">
          <h2 className="h3-bold md:h2-bold text-left">Joining requests</h2>
          <ul className="list-none ">
            {props.community.pendingRequests.length > 0 ? (
              props.community?.pendingRequests.map((member: any) => (
                <div className="flex justify-between">
                  <Link
                    to={`/profile/${member.username}`}
                    className="flex gap-3 items-center"
                  >
                    <img
                      src={
                        member.profilePic
                          ? member.profilePic
                          : "../../public/assets/images/defaultImage.png"
                      }
                      alt="user image"
                      className="h-14 w-14 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="body-bold">{member.name}</p>
                      <p className="small-regular text-light-3">
                        @{member.username}
                      </p>
                    </div>
                  </Link>

                  <div className="flex justify-center gap-1">
                    <Button
                      type="button"
                      className="shad-button_primary px-1 rounded-xl"
                      onClick={() => handleAcceptReq(member.id, "accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      className="bg-transparent border-2 border-primary-500 rounded-xl px-1"
                      onClick={() => handleAcceptReq(member.id, "deny")}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#868686]">No requests</p>
            )}
          </ul>
        </div>
      </div>
      <div className="w-full rounded-xl border-2 border-light-4 overflow-hidden mt-6">
        <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4 ">
          <h2 className="h3-bold md:h2-bold text-left">Pending posts</h2>
          {totalSize > 0 ? (
            <ul className="flex flex-col flex-1 gap-9 w-full pb-[10%] md:pb-0">
            <InfiniteScroll
              loader={
                <SyncLoader
                  className="mx-[36%] my-[20%] object-cover"
                  color={"#877EFF"}
                  loading={true}
                  size={40}
                />
              }
              className="flex gap-9 flex-col w-full flex-1"
              fetchMore={() => setPage((prev) => prev + 1)}
              hasMore={
                pendingPosts.length < totalSize && pendingPosts.length > 0 && loading === false
              }
              endMessage={
                pendingPosts.length != 0 && !loading ? (
                  <p className="text-center">You have seen it all</p>
                ) : pendingPosts.length === 0 && !loading ? (
                  <p className="text-center">Let's make more friends to see more posts</p>
                ) : (
                  <SyncLoader
                    className="mx-[28%] my-[20%] object-cover"
                    color={"#877EFF"}
                    loading={true}
                    size={50}
                  />
                )
              }
            >
              {pendingPosts.map((post: any, index: any) => (
                <li key={index} className="flex justify-center w-full">
                  <PostCard post={post} pending={post.pending} confirmPost={confirmPost} />
                </li>
              ))}
            </InfiniteScroll>
          </ul>
          ) : (
            <p className="text-center text-[#868686]">No pending posts</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserList;
