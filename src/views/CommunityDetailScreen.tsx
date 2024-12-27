import PostCard from "@/components/PostCard.tsx";
import { useEffect, useState } from "react";
import { ScaleLoader, SyncLoader } from "react-spinners";
import InfiniteScroll from "@/components/InfinitveScroll";
import { useNavigate, useParams } from "react-router-dom";
import { getCommunityDetail, getPostDetailCommunity, joinCommunity, leaveCommunity } from "@/services/communityService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import GridMediaList from "@/components/GridMediaList";
import InforCommunity from "@/components/InforCommunity";
import UserList from "@/components/UserList";

const CommunityDetailScreen = () => {
  const [posts, setPosts] = useState<any>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [community, setCommunity] = useState({});
  const [tab, setTab] = useState(0);
  const [notification, setNotification] = useState("");
  const currentUser = useSelector((state:any)=>state.auth.login.currentUser);
  const navigate = useNavigate();
  const params = useParams();

  const handleRequestJoin = async () => {
    try {
      const result = await joinCommunity(params["*"]);
      if (result === "REPORT_00") {
        setNotification(result);
        toast.success("Request sent successfully");
      } else if (result === "REPORT_03") {
        setNotification(result);
        toast.info("Remove request sent successfully");
      } else {
        setNotification(result);
        toast.error("Request sent failed");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const result = await leaveCommunity(params["*"]);
      setCommunity(result);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (!navigator.onLine) {
        navigate("/loss-connection");
      }
      const result = await getCommunityDetail(params["*"]);
      setCommunity(result);
    })();
  }, [params, notification]);

  useEffect(() => {    
    (() => {
      setLoading(true);
      if (navigator.onLine) {
        setTimeout(async () => {
          try {
            const { feedPosts, totalSize } = await getPostDetailCommunity(params["*"], page);
            setPosts((prevPosts: any) => [...prevPosts, ...feedPosts]);
            setTotalSize(totalSize);
            setLoading(false);
          } catch (error: any) {
            console.log(error.message);
            setLoading(false);
          }
        }, 500);
      }
    })();
  }, [page]);

  return (
    <div className="flex flex-1  overflow-x-hidden">
      <div className="home-container md:p-14">
        <section className="xl:w-[70%] 2xl:w-[60%] w-full">
          <div className="w-full rounded-xl border-2 border-light-4 overflow-hidden">
            {community.profilePic ? (
              <img
              src={community.profilePic}
              alt="Grap Image"
              className=" w-full object-cover"
            />) : (
              <ScaleLoader color="#877EFF" loading={true} height={200} />
            )
            }
            <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4">
              <h2 className="h3-bold md:h2-bold text-left">
                {community.name}
              </h2>
              <p className="small-medium lg:base-medium">
                {community.description}
              </p>
              <div className="flex flex-col gap-1 md:flex-row md:justify-between">
                <div className="flex gap-[0.5rem] items-center">
                  <div className="flex">
                    {community?.members?.map((member: any, index: any) => (
                      <section
                        className="rounded-full w-10 h-10 bg-black"
                        style={{
                          zIndex: 20 - index,
                          translate:-12*index
                        }}
                        key={index}
                      >
                        <img
                          src={
                            member
                              ? member.profilePic
                              : "/assets/images/defaultImage.png"
                          }
                          alt="creator"
                          style={{
                            objectFit: "cover",
                            width: "36px",
                            height: "36px",
                            borderRadius: "999px",
                            marginLeft: "2px",
                            marginTop: "2px",
                          }}
                        />
                      </section>
                    ))}
                  </div>
                  <p className="">{community?.members?.length} <span className="text-light-3">Members</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="border-white p-2 border-[1px] rounded-full" onClick={()=>{
                    if (currentUser?.id === community?.founder?.id || community?.members?.some(member => member.id === currentUser?.id)) {
                      navigate(`/create-post/${params["*"]}`)
                    } else {
                      Swal.fire({
                        icon: 'warning',
                        title: 'NOT ALLOWED',
                        text: 'You need to join the community first',
                        timer: 2500,
                      })
                    }
                  }}>
                    <img src="/assets/icons/Export.svg" alt="" />
                  </button>
                  {currentUser?.id === community?.founder?.id ? (
                    <button
                      className=" py-2 px-4 rounded-full bg-green-500"
                      onClick={()=>setTab(3)}
                    >
                      Manage join request
                    </button>
                  ) : community?.members?.some(member => member.id === currentUser?.id) ? (
                    <button className="border-white px-4 py-2 border-[1px] rounded-full" onClick={handleLeaveCommunity}>Leave</button>
                  ) : community?.pendingRequests?.some(member => member.id === currentUser?.id) ? (
                    <button className="border-[#898c8e] px-4 py-2 border-[1px] rounded-full text-[#898c8e]" onClick={handleRequestJoin}>Pending</button>
                  ) : (
                    <button className="border-white px-4 py-2 border-[1px] rounded-full" onClick={handleRequestJoin}>Join</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="home-posts">
        <section className="w-full flex gap-0 relative pb-2">
            <h2
              className="h3-bold md:h2-bold text-left basis-[50%] cursor-pointer text-center"
              style={{ opacity: tab === 0 ? 1 : 0.5 }}
              onClick={() => setTab(0)}
            >
              Latest
            </h2>
            <span className="h3-bold md:h2-bold bg-white h-[100%] w-[10px] rounded-2xl"></span>
            <h2
              className="h3-bold md:h2-bold text-left basis-[50%] pl-4 cursor-pointer text-center"
              style={{ opacity: tab === 1 ? 1 : 0.5 }}
              onClick={() => setTab(1)}
            >
              Media
            </h2>
            <span className="h3-bold md:h2-bold bg-white h-[100%] w-[10px] rounded-2xl"></span>
            <h2
              className="h3-bold md:h2-bold text-left basis-[50%] pl-4 cursor-pointer text-center"
              style={{ opacity: tab === 2 ? 1 : 0.5 }}
              onClick={() => setTab(2)}
            >
              About
            </h2>
            {tab != 3 && (
              <div
              className="absolute bottom-0 h-[2px] bg-primary-500 transition-transform duration-300 rounded-xl"
              style={{
                width: "33%",
                transform: `translateX(${tab * 100}%)`,
              }}
            />
            )}
          </section>
          <ul className="flex flex-col flex-1 gap-9 w-full pb-[10%] md:pb-0">
            {tab===0 && (
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
                posts.length < totalSize &&
                posts.length > 0 &&
                loading === false
              }
              endMessage={
                posts.length != 0 && !loading ? (
                  <p className="text-center">You have seen it all</p>
                ) : posts.length === 0 && !loading ? (
                  <p className="text-center">
                    There is no posts in this community
                  </p>
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
              {
                posts.map((post: any, index: any) => (
                  <li key={index} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                ))
              }
            </InfiniteScroll>
            ) }
          </ul>
        </div>
        {tab===1 && (
          <GridMediaList userId={community?.id} />  
        )}

        {tab===2 && (
          <InforCommunity community={community} />
        )}

        {tab===3 && (
          <UserList community={community} />
        )}
      </div>
    </div>
  );
};

export default CommunityDetailScreen;
