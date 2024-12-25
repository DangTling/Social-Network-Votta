import InfiniteScroll from "@/components/InfinitveScroll";
import { getAllNotification } from "@/services/notificationService";
import { timeAgo } from "@/utils/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { DotLoader } from "react-spinners";

const NotificationScreen = (props: Props) => {
  const { setPage } = useOutletContext()
  

  const { listNotify, totalNotification } = useSelector((state: any) => state.notification);


  return (
    <div className="flex flex-1 overflow-x-hidden">
      <div className="home-container" style={{ overflowY: "hidden"}}>
      <div
        id="dropdownNotification"
        className="z-20 w-full h-[100vh] home-posts"
        aria-labelledby="dropdownNotificationButton"
      >
        <div className="h3-bold md:h2-bold text-left w-full">
          Notifications
        </div>
        <div className="h-full overflow-hidden overflow-y-scroll mb-60">
          <InfiniteScroll   
            loader={
              <DotLoader color={"#877EFF"} loading={true} size={40} className="mx-auto"/>
            }
            fetchMore={() => setPage((prev:any) => prev + 1)}
            hasMore={listNotify.length < totalNotification && listNotify.length > 0}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen them all</b>
              </p>
            }
            className={" mb-6"}
          >
            {listNotify &&
              listNotify.map((notify: any) => {
                return (
                  <Link
                    to={notify.postId !== null ? `/posts/${notify?.postId}/${notify?.ownerId}` : `/profile/${notify?.impactPersonUsername}`}
                    className="flex px-4 py-3 hover:bg-gray-700 relative bg-gray-800 text-white rounded-lg mb-6"
                    key={notify?.id}
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="rounded-full w-11 h-11"
                        src={notify?.impactPersonProfilePic}
                        alt="Jese image"
                      />
                      <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border  rounded-full border-gray-800">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 18"
                        >
                          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                          <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full ps-3">
                      <div className=" text-sm mb-1.5 text-gray-400">
                        New notification from {" "}
                        <span className="font-semibold text-white">
                          {notify?.impactPersonName}  
                        </span>: "
                        {notify?.content}"
                      </div>
                      <div className="text-xs text-blue-500">
                        {timeAgo(notify.createdAt)}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </InfiniteScroll>
        </div>
        
      </div>
      </div>
    </div>
  )
}

export default NotificationScreen;