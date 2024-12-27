import { useEffect, useState } from "react";
import {
  checkSessionLogin,
  findUserByName,
  getTopCreators,
} from "@/services/userService.ts";
import { useDispatch, useSelector } from "react-redux";
import * as React from "react";
import { findUserFail, findUserSuccess } from "@/redux/reducers/userSlice.ts";
import UserCard from "@/components/UserCard.tsx";
import {
  DotLoader,
  HashLoader,
  PacmanLoader,
  SyncLoader,
} from "react-spinners";
import useDebounce from "@/hooks/UseDebounce";
import {
  getAllPosts,
  getPopularPosts,
  postActions,
} from "@/redux/reducers/postSlice";
import InfiniteScroll from "@/components/InfinitveScroll";
import { Link } from "react-router-dom";
import PostStatus from "@/components/PostStatus";

const ExploreScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [usersFound, setUsersFound] = useState<any[]>([]);
  const { topCreator } = useSelector((state: any) => state.post);
  const [page, setPage] = useState(1);
  const [allPage, setAllPage] = useState(0);
  const { popularPosts, totalPost, allPosts, totalAllPost } = useSelector(
    (state: any) => state.post
  );

  const query = {
    page: page,
    size: 6,
  };

  const allQuery = {
    query: null,
    page: allPage,
    size: 6,
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsLoading(true);
    debounceHandleSearch(value);
    dispatch(postActions.setAllPosts([]));
    setAllPage(0);
  };

  const handleSearch = async (value: string) => {
    if (value.trim() !== "") {
      try {
        dispatch(postActions.setPopularPosts([]));
        setPage(1);
        const result = await findUserByName(value, dispatch);
        dispatch(
          getAllPosts({
            ...allQuery,
            query: value,
          })
        );
        if (Array.isArray(result)) {
          dispatch(findUserSuccess(result));
          setUsersFound(result);
        } else {
          dispatch(findUserFail());
          setUsersFound([]);
        }
      } catch (error: any) {
        console.log(error);
        dispatch(findUserFail());
        setUsersFound([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setAllPage(0);
      dispatch(postActions.setAllPosts([]));
      dispatch(getPopularPosts(query));
      setUsersFound([]);
      setIsLoading(false);
    }
  };

  const debounceHandleSearch = useDebounce(handleSearch, 1500);

  useEffect(() => {
    dispatch(getPopularPosts(query));
  }, [page]);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      dispatch(getAllPosts({
        ...allQuery,
        query: searchValue}));
    }
  }, [allPage]);

  return (
    <div className="explore-container overflow-y-scroll h-[100vh] md:h-auto">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 ">
          <img
            src="/assets/icons/search.svg"
            alt="search icon"
            width={24}
            height={24}
          />
          <input
            type="text"
            placeholder="Search whatever you like"
            value={searchValue}
            onChange={handleSearchChange}
            className="explore-search"
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-lg px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter icon"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 justify-center lg:justify-start w-full max-w-5xl">
        {isLoading ? (
          <PacmanLoader
            className="mx-[18%] my-[8%]"
            color={"#877EFF"}
            loading={isLoading}
            size={100}
          />
        ) : !isLoading && searchValue.trim() === "" ? (
          topCreator
            .slice(0, 6)
            .map((creator: any) => (
              <UserCard
                key={creator.username}
                name={creator.name}
                profilePic={creator.profilePic}
                username={creator.username}
              />
            ))
        ) : usersFound.length !== 0 ? (
          usersFound.map((userFound: any) => (
            <UserCard
              key={userFound.username}
              name={userFound.name}
              profilePic={userFound.profilePic}
              username={userFound.username}
            />
          ))
        ) : (
          searchValue.trim() !== "" && (
            <p
              className="text-7xl font-odibeeSan text-red mx-auto my-[13%] font-bold"
              style={{ wordSpacing: "10px", textTransform: "uppercase" }}
            >
              Cannot find user named {searchValue} !
            </p>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-9 justify-center lg:justify-start w-full max-w-5xl mt-8">
        {searchValue.trim() === "" ? (
          <div className="h-full">
            <InfiniteScroll
              loader={
                <DotLoader
                  className="mx-[36%] my-[20%] object-cover"
                  color={"#877EFF"}
                  loading={true}
                  size={40}
                />
              }
              className="grid-container w-full"
              fetchMore={() => setPage((prevPage) => prevPage + 1)}
              hasMore={
                popularPosts.length < totalPost && popularPosts.length > 0
              }
              endMessage={
                <p
                  className="text-7xl font-odibeeSan text-red mx-auto my-[13%] font-bold"
                  style={{ wordSpacing: "10px", textTransform: "uppercase" }}
                >
                  No more posts in week
                </p>
              }
            >
              {popularPosts.map((post: any) => (
                <li className="relative min-w-80 h-80" key={post.id}>
                  <Link
                    to={`/posts/${post.id}/${post.postedBy.id}`}
                    className="grid-post_link"
                  >
                    <img
                      src={
                        post?.postPic
                          ? post?.postPic
                          : "/assets/images/logo-no-background.svg"
                      }
                      alt="Post Image"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="grid-post_user">
                    <div className="flex items-center justify-start gap-2 flex-1">
                      <img
                        src={
                          post?.postedBy?.profilePic
                            ? post?.postedBy?.profilePic
                            : "/assets/images/logo-no-background.svg"
                        }
                        alt="Avatar image"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="line-clamp-1">{post?.postedBy?.name}</p>
                    </div>
                    <PostStatus post={post} />
                  </div>
                </li>
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="h-full">
            <InfiniteScroll
              loader={
                <DotLoader
                  className="mx-[36%] my-[20%] object-cover"
                  color={"#877EFF"}
                  loading={true}
                  size={40}
                />
              }
              className="grid-container w-full"
              fetchMore={()=>setAllPage((prevPage) => prevPage + 1)}
              hasMore={allPosts.length < totalAllPost && allPosts.length > 0}
              endMessage={
                <p
                  className="text-5xl font-odibeeSan text-red mx-auto my-[13%] font-bold"
                  style={{ wordSpacing: "10px", textTransform: "uppercase" }}
                >
                  No more posts in week
                </p>
              }
            >
              {allPosts.map((post: any) => (
                <li className="relative min-w-80 h-80" key={post.id}>
                  <Link
                    to={`/posts/${post.id}/${post.postedBy.id}`}
                    className="grid-post_link"
                  >
                    <img
                      src={
                        post?.postPic
                          ? post?.postPic
                          : "/assets/images/logo-no-background.svg"
                      }
                      alt="Post Image"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="grid-post_user">
                    <div className="flex items-center justify-start gap-2 flex-1">
                      <img
                        src={
                          post?.postedBy?.profilePic
                            ? post?.postedBy?.profilePic
                            : "/assets/images/logo-no-background.svg"
                        }
                        alt="Avatar image"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="line-clamp-1">{post?.postedBy?.name}</p>
                    </div>
                    <PostStatus post={post} />
                  </div>
                </li>
              ))}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
