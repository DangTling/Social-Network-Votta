import {Link} from "react-router-dom";
import PostStatus from "@/components/PostStatus.tsx";
import {useEffect, useState} from "react";
import { getPostDetailCommunity } from "@/services/communityService";
import InfiniteScroll from "./InfinitveScroll";
import { SyncLoader } from "react-spinners";

const GridMediaList = ({userId}:any) => {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(0)
    const [totalSize, setTotalSize] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            if (navigator.onLine) {
                try {
                    const {feedPosts, totalSize} = await getPostDetailCommunity(userId, page)
                    setPosts(feedPosts)
                    setTotalSize(totalSize)
                    setLoading(false)
                } catch (error:any) {
                    console.log(error.message)
                    setLoading(false)
                }
            }
        }
        fetchPosts()
    }, [userId]);

    if (posts === null) {
        return
    }

    return (
        <ul className="mb-[20%] md:mb-0">
             <InfiniteScroll
                loader={
                  <SyncLoader
                    className="mx-[36%] my-[20%] object-cover"
                    color={"#877EFF"}
                    loading={true}
                    size={40}
                  />
                }
                className="grid-container"
                fetchMore={() => 
                  setPage((prev) => prev + 1)
                }
                hasMore={
                  posts.length < totalSize &&
                  posts.length > 0 &&
                  loading === false
                }
                endMessage={
                  posts.length != 0 && !loading ? (
                    <p className="flex justify-center items-center">You have seen it all</p>
                  ) : posts.length === 0 && !loading ? (
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
                {posts.map((post:any,id:any) => (
                <li className="relative min-w-80 h-80" key={id}>
                    <Link to={`/posts/${post.id}/${userId}`} className="grid-post_link">
                        <img src={post?.postPic ? post?.postPic : "../../public/assets/images/logo-no-background.svg"} alt="Post Image"
                             className="w-full h-full object-cover"/>
                    </Link>
                    <div className="grid-post_user">
                        <div className="flex items-center justify-start gap-2 flex-1">
                            <img src={post?.postedBy?.profilePic ? post?.postedBy?.profilePic : "../../public/assets/images/logo-no-background.svg"} alt="Avatar image"
                                 className="w-8 h-8 rounded-full"/>
                            <p className="line-clamp-1">{post?.postedBy?.name}</p>
                        </div>
                        <PostStatus post={post} />
                    </div>
                </li>
            ))}
              </InfiniteScroll>
            
        </ul>
    );
};

export default GridMediaList;