import PostCard from "@/components/PostCard.tsx";
import UserCard from "@/components/UserCard.tsx";
import { useEffect, useState } from "react";
import { getFeed } from "@/services/postService.ts";
import { SyncLoader } from "react-spinners";
import InfiniteScroll from "@/components/InfinitveScroll";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePageScreen = () => {
  const [posts, setPosts] = useState<any>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { topCreator } = useSelector((state: any) => state.post);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      if (navigator.onLine) {
        console.log("Online")        
      } else {
        navigate("/loss-connection")
      }
    })();
  }, [params]);

  useEffect(() => {
    ( () => {
      setLoading(true);
      if (navigator.onLine) {
        setTimeout(async() => {
          try {
            const {feedPosts, totalSize} = await getFeed(page);
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
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Home Page
          </h2>
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
                posts.length < totalSize && posts.length > 0 && loading === false
              }
              endMessage={
                posts.length != 0 && !loading ? (
                  <p className="text-center">You have seen it all</p>
                ) : posts.length === 0 && !loading ? (
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
              {posts.map((post: any, index: any) => (
                <li key={index} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </InfiniteScroll>
          </ul>
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {topCreator.map((creator: any, index: any) => (
            <li key={index}>
              <UserCard
                username={creator.username}
                name={creator.name}
                profilePic={creator.profilePic}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePageScreen;
