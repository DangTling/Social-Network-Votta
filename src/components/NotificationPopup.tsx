import { timeAgo } from "@/utils/utils";
import { Link } from "react-router-dom";
import InfiniteScroll from "./InfinitveScroll";
import { DotLoader } from "react-spinners";

const NotificationPopup = (props: Props) => {
  return (
    <div className="flex absolute top-0 right-[-28rem] justify-start fade-in w-[24rem]">
      <img
        src="/assets/images/Polygon.svg"
        alt=""
        className="absolute left-[-1.5rem]"
      />
      <div
        id="dropdownNotification"
        className="z-20 w-full max-w-sm  divide-y rounded-lg  bg-gray-800 divide-gray-700"
        aria-labelledby="dropdownNotificationButton"
      >
        <div className="block px-4 py-2 font-medium text-center  rounded-t-lg bg-gray-800 text-white">
          Notifications
        </div>
        <div className="divide-y divide-gray-700 h-96 overflow-hidden overflow-y-scroll custom-scrollbar">
          <InfiniteScroll 
            loader={
              <DotLoader color={"#877EFF"} loading={true} size={40} className="mx-auto"/>
            }
            fetchMore={() => props.setPage((prev:any) => prev + 1)}
            hasMore={props.list.length < props.totalNotification && props.list.length > 0}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen them all</b>
              </p>
            }
            className={" mb-6"}
          >
            {props.list &&
              props.list.map((notify: any) => {
                return (
                  <Link
                    to={notify.postId !== null ? `/posts/${notify?.postId}/${notify?.ownerId}` : `/profile/${notify?.impactPersonUsername}`}
                    className="flex px-4 py-3 hover:bg-gray-700 relative"
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
        <a
          href="#"
          className="block py-2 text-sm font-medium text-center  rounded-b-lg  bg-gray-800 hover:bg-gray-700 text-white"
        >
          <div className="inline-flex items-center ">
            <svg
              className="w-4 h-4 me-2 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 14"
            >
              <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};

export default NotificationPopup;
