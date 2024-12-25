import Skeleton from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChatRow from "@/components/ChatRow";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationActions,
  getConversations,
} from "@/redux/reducers/conversationSlice";
import ChatDetailScreen from "./ChatDetailScreen";

const ChatPageScreen = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dispatch = useDispatch();
  const { list, loading, isError, selectedConversation } = useSelector(
    (state: any) => state.conversation
  );

  const handleSearchChange = (val: any) => {
    setSearchValue(val);
  };

  const handleSelectConversation = (conversation: any) => {
    dispatch(conversationActions.setSelectedConversation(conversation));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    // if (debouncedSearch === "") {
      dispatch(getConversations(debouncedSearch));
    // }
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load conversations");
    }
  }, [isError]);

  return (
    <div className="flex flex-1 overflow-x-hidden">
      <div className="home-container md:hidden">
        <div className="explore-inner_container relative">
          <h2 className="h3-bold md:h2-bold w-full">Your Conversations</h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 ">
            <img
              src="../../public/assets/icons/add-contact.svg"
              alt="search icon"
              width={24}
              height={24}
            />
            <input
              type="text"
              placeholder="Search for a user"
              value={searchValue}
              onChange={handleSearchChange}
              className="explore-search"
            />
          </div>
          {searchValue.length > 0 && (
            <div className="bg-gray-400 w-full h-[30vh] absolute bottom-[-50px]">
              as
            </div>
          )}
        </div>
        <div className="explore-inner_container">
          <h3 className="base-semibold md:h3-bold w-full">Messages</h3>
          {loading && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} />)}
          {!loading &&
            list?.map((conversation: any) => (
              <ChatRow selectConversation={handleSelectConversation} conversation={conversation} key={conversation.id} />
            ))}
        </div>
      </div>

      <div className="w-full h-full md:flex justify-center items-center hidden">
        <div className="flex w-[80%] h-[80%] rounded-2xl overflow-hidden  border-light-4 border-2">
          <div className="w-[33%] border-light-4 border-r-2">
            <div className="border-light-4 border-b-2 pb-4">
              <form className="w-[95%] mx-auto mt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <img src="../../public/assets/icons/add-contact.svg" alt="" />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-12 text-sm border border-gray-300 rounded-lg bg-dark-4 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search other users"
                    value={searchValue}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                    }}
                  />
                  <button
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
            <div className="explore-inner_container px-6 py-4 overflow-y-scroll custom-scrollbar">
              {loading && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} />)}
              {!loading &&
                list.map((conversation: any) => (
                  <ChatRow
                    conversation={conversation}
                    key={conversation.id}
                    selectConversation={handleSelectConversation}
                  />
                ))}
            </div>
          </div>
          <div className="flex-[2] h-full">
            {selectedConversation ? (
              <ChatDetailScreen />
            ) : (
              <section className="flex flex-1 justify-center items-center flex-col py-10 px-5">
                <img
                  src="../../public/assets/images/Bubble chat.svg"
                  alt=""
                  className=" object-cover bg-no-repeat"
                />
                <p className="h2-bold text-light-1 text-center line-clamp-2">
                  Select a conversation to start chat
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPageScreen;
