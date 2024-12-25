import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import InfiniteScroll from "@/components/InfinitveScroll";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostCardForCommunity from "@/components/PostCardForCommunity";
import {
  getFeedForCommunity,
  getFeedMyCommunities,
  getMyCommunities,
  getTopCommunity,
} from "@/services/communityService";
import CommunityCard from "@/components/CommunityCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { updateTabInCommunityPage } from "@/redux/reducers/userSlice";

const CommunityScreen = () => {
  const [posts, setPosts] = useState<any>([]);
  const [postsMyCommunities, setPostsMyCommunities] = useState<any>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [totalMyCommunitiesSize, setTotalMyCommunitiesSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [runningOne, setRunningOne] = useState(true);
  const [runningTwo, setRunningTwo] = useState(true);
  const [page, setPage] = useState(0);
  const [pageMyCommunities, setPageMyCommunities] = useState(0);
  const [topCreators, setTopCreators] = useState<any>([]);
  const tab = useSelector((state: any) => state.user.tabInCommunitiyPage);
  const dispatch = useDispatch()
  const [myCommunities, setMyCommunities] = useState<any>([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      if (navigator.onLine) {
        try {
          const result = await getTopCommunity();
          setTopCreators(result);
        } catch (error: any) {
          console.log(error.message);
        }
      } else {
        navigate("/loss-connection");
      }
    })();
  }, [params]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (navigator.onLine) {
        if (tab === 0 && runningOne) {
          setTimeout(async () => {
            try {
              const { feedPosts, totalSize } = await getFeedForCommunity(page);
              setPosts((prevPosts: any) => [...prevPosts, ...feedPosts]);
              setTotalSize(totalSize);
              setLoading(false);
              setRunningOne(false);
            } catch (error: any) {
              console.log(error.message);
              setLoading(false);
            }
          }, 500);
        }
        if (tab === 1 && runningTwo) {
          const result = await getMyCommunities();
          setMyCommunities(result);
          setTimeout(async () => {
            try {
              const { feedPosts, totalSize } = await getFeedMyCommunities(
                pageMyCommunities
              );
              setPostsMyCommunities((prevPosts: any) => [
                ...prevPosts,
                ...feedPosts,
              ]);
              setTotalMyCommunitiesSize(totalSize);
              setLoading(false);
              setRunningTwo(false);
            } catch (error: any) {
              console.log(error.message);
              setLoading(false);
            }
          }, 500);
        }
      }
      setTimeout(() => {
      setLoading(false);
        
      }, 3000)      
    })();
  }, [page, pageMyCommunities, tab]);

  return (
    <div className="flex flex-1  overflow-x-hidden">
      <div className="home-container" style={{paddingBottom:0}}>
        <div className="home-posts relative" style={{overflow: "hidden"}}>
          <button className="absolute top-0 right-0 w-12 h-12 rounded-full bg-primary-500 flex justify-center items-center z-30" onClick={() => navigate("/create-community")}>
            <img src="../../public/assets/icons/group_add_fill.svg" alt="" className="w-8 h-8" />
          </button>
          <section className="w-full flex gap-0 relative pb-2">
            <h2
              className="h3-bold md:h2-bold text-left basis-[50%] cursor-pointer"
              style={{ opacity: tab === 0 ? 1 : 0.5 }}
              onClick={() => dispatch(updateTabInCommunityPage(0))}
            >
              Feeds
            </h2>
            <span className="h3-bold md:h2-bold bg-white h-[100%] w-[10px] rounded-2xl"></span>
            <h2
              className="h3-bold md:h2-bold text-left basis-[50%] pl-4 cursor-pointer"
              style={{ opacity: tab === 1 ? 1 : 0.5 }}
              onClick={() => dispatch(updateTabInCommunityPage(1))}
            >
              Discover
            </h2>
            <div
              className="absolute bottom-0 h-[2px] bg-primary-500 transition-transform duration-300 rounded-xl"
              style={{
                width: "50%",
                transform: `translateX(${tab * 100}%)`,
              }}
            />
          </section>
          <ul className="flex flex-col flex-1 gap-9 w-full custom-scrollbar overflow-scroll pb-[22%] md:pb-0">
            {tab === 0 ? (
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
                fetchMore={() => {
                  setPage((prev) => prev + 1);
                  setRunningOne(true);
                }}
                hasMore={
                  posts.length < totalSize &&
                  posts.length > 0 &&
                  loading === false
                }
                endMessage={
                  !loading ? (
                    <p className="text-center">You have seen it all</p>
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
                {posts.map((post: any, index: any) => (
                  <li
                    key={index}
                    className="flex justify-center w-full"
                  >
                    <PostCardForCommunity post={post} />
                  </li>
                ))}
              </InfiniteScroll>
            ) : (
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
                fetchMore={() => {
                  setPageMyCommunities((prev) => prev + 1);
                  setRunningTwo(true)
                }}
                hasMore={
                  postsMyCommunities.length < totalMyCommunitiesSize &&
                  postsMyCommunities.length > 0 &&
                  loading === false
                }
                endMessage={
                  postsMyCommunities.length != 0 && !loading ? (
                    <p className="text-center">You have seen it all</p>
                  ) : postsMyCommunities.length === 0 && !loading ? (
                    <p className="text-center">
                      Let's join more communities to see more posts
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
                <section className="static border-b-2 border-b-primary-500 pb-4">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    loop={false}
                    navigation={true}
                  >
                    {myCommunities.map((community: any, index: any) => (
                      <SwiperSlide key={index} className="mr-4">
                        <Link
                          to={`/community/${community.id}`}
                          className="w-[110px] md:w-[180px] "
                          style={{
                            paddingLeft: "0",
                            paddingRight: "0",
                            paddingTop: "0",
                            overflow: "hidden",
                            gap: "0.5rem",
                            paddingBottom: "0.5rem",
                            height: "80px",
                            rowGap: "0",
                            flexDirection: "column",
                            borderRadius: "20px",
                            border: "1px solid #1f1f22",
                            display: "flex",
                          }}
                        >
                          <section className="w-full h-[70%] mb-3">
                            <img
                              src={community.profilePic}
                              alt="creator"
                              className="object-cover h-[100%] w-full"
                            />
                          </section>
                          <div className="flex-center flex-col">
                            <p className="base-medium text-light-1 text-start line-clamp-1 px-2">
                              {community.name}
                            </p>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
                {postsMyCommunities.map((post: any, index: any) => (
                  <li
                    key={index}
                    className="flex justify-center w-full"
                  >
                    <PostCardForCommunity post={post} />
                  </li>
                ))}
              </InfiniteScroll>
            )}
          </ul>
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1" style={{ wordSpacing: "5px" }}>
          Community may interest you
        </h3>
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {topCreators.map((creator: any, index: any) => (
            <li key={index}>
              <CommunityCard
                totalMembers={creator.members.length}
                name={creator.name}
                profilePic={creator.profilePic}
                members={creator.members}
                id={creator.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunityScreen;
