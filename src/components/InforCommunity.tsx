import { sendFollowRequest } from "@/services/userService";
import { convertTime } from "@/utils/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

const InforCommunity = ({ community }: any) => {
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const [follow, setFollow] = useState("Follow");
    const [followingState, setFollowingState] = useState({})


  const handleSendFollow = async (targetId: string) => {
    const result = await sendFollowRequest(targetId, currentUser?.id);
    if (typeof result === "string") {
      toast.success(result);
    } else {
      toast.error(result.message);
    }
    setFollow("Have sent request");
    setFollowingState((prevState)=> ({
        ...prevState,
        [targetId]: true
    }))
  };
  

  return (
    <section className="xl:w-[70%] 2xl:w-[60%] w-full mb-[20%] md:mb-0">
      <div className="w-full rounded-xl border-2 border-light-4 overflow-hidden">
        <div className="w-full bg-[#16181c] gap-10 flex flex-col p-4">
          <h2 className="h3-bold md:h2-bold text-left">Community Info</h2>
          <section className="px-10 flex gap-2">
            <img
              src="../../public/assets/icons/people.svg"
              alt="Icon community"
            />
            <p className="small-medium lg:base-medium text-light-3">
              Only members can post, like, or reply.
            </p>
          </section>
          <section className="px-10 flex gap-2">
            <img
              src="../../public/assets/icons/world_2.svg"
              alt="Icon everyone"
            />
            <p className="small-medium lg:base-medium text-light-3">
              All Communities are publicly visible.
            </p>
          </section>
          <section className="px-10 flex gap-2">
            <img
              src="../../public/assets/icons/Date_today.svg"
              alt="Icon time"
            />
            <p className="small-medium lg:base-medium text-light-3">
              Created {convertTime(community?.createdAt)} by{" "}
              <span className="text-white">
                @{community.founder.username}.
              </span>
            </p>
          </section>
        </div>
        <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4 border-t-2 border-light-4">
          <h2 className="h3-bold md:h2-bold text-left">Rules</h2>
          <p className="small-medium lg:base-medium font-thin">
            There are in addition to{" "}
            <span className="text-primary-500">Votta's rules.</span>
          </p>
          <ul className="list-none pl-10">
            <li className="small-medium lg:base-medium flex items-center mt-8 text-[18px]">
              <div className="bg-[#333] text-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 font-bold">
                1
              </div>
              <p>Be kind and respectful.</p>
            </li>
            <li className="small-medium lg:base-medium flex items-center mt-8 text-[18px]">
              <div className="bg-[#333] text-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 font-bold">
                2
              </div>
              <p>Keep Tweets on topic.</p>
            </li>
            <li className="small-medium lg:base-medium flex items-center mt-8 text-[18px]">
              <div className="bg-[#333] text-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 font-bold">
                3
              </div>
              <p>Explore and share.</p>
            </li>
            <li className="small-medium lg:base-medium flex items-center mt-8 text-[18px]">
              <div className="bg-[#333] text-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 font-bold">
                4
              </div>
              <p>The vibes must be immaculate.</p>
            </li>
          </ul>
        </div>
        <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4 border-t-2 border-light-4">
          <h2 className="h3-bold md:h2-bold text-left">Moderators</h2>
          <ul className="list-none ">
            {community?.founder && (
              <Link to="/profile" className="flex gap-3 items-center">
                <img
                  src={
                    community.founder.profilePic
                      ? community.founder?.profilePic
                      : "../../public/assets/images/defaultImage.png"
                  }
                  alt="user image"
                  className="h-14 w-14 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="body-bold">{community.founder?.name}</p>
                  <p className="small-regular text-light-3">
                    @{community.founder?.username}
                  </p>
                </div>
              </Link>
            )}
            <div className="flex justify-center gap-4">
              {currentUser?.username !== community?.founder?.username &&
                community?.founder?.follower?.some(
                  (user: any) => user.id !== currentUser?.id
                ) && (
                  <Button
                    type="button"
                    onClick={() => handleSendFollow(community.founder.id)}
                    className={`shad-button_primary px-8 ${
                      follow === "Have sent request" &&
                      "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    }`}
                  >
                    {follow}
                  </Button>
                )}
            </div>
          </ul>
        </div>
        <div className="w-full bg-[#16181c] gap-3 flex flex-col p-4 border-t-2 border-light-4">
          <h2 className="h3-bold md:h2-bold text-left">Members</h2>
          <ul className="list-none ">
            {community?.members.slice(1).map((member: any) => 
              <div className="flex justify-between">
                <Link to={`/profile/${member.username}`} className="flex gap-3 items-center">
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
            
                <div className="flex justify-center gap-4">
                {currentUser?.username !== member.username && currentUser?.following.some((user:any)=>user.id ===  member.id) && (
                    <Button type="button" className="shad-button_primary px-8"
                    onClick={() => handleSendFollow(member.id)}
                    disabled={followingState[member.id]}
                    >
                        Follow
                    </Button>
                )}
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default InforCommunity;
