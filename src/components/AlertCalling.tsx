import { conversationActions } from "@/redux/reducers/conversationSlice";

const AlertCalling = ({ participant, dispatch, socket, currentUser, meetingID }) => {
  return (
    <>
      <iframe
        src="/assets/audio/iPhone.mp3"
        allow="autoplay"
        className="hidden"
      ></iframe>
      <div
        id="popup-modal"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative  rounded-lg shadow bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => {
                dispatch(conversationActions.setCallStatus(null));
                socket.emit("cancelCall", {
                  senderId: currentUser,
                  receiverId: participant?.id,
                  meetingId: null,
                });
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <img
                src="/assets/icons/bell.svg"
                alt=""
                className="bell mx-auto mb-4 w-12 h-12"
              />
              <h3 className="mb-5 text-lg font-normal  text-gray-400">
                {participant?.name} is calling to you!
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={()=> {
                    dispatch(conversationActions.setCallStatus(null));
                    dispatch(conversationActions.setMeetingId(meetingID));
                }}
              >
                Accept
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium  focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  dispatch(conversationActions.setCallStatus(null));
                  socket.emit("cancelCall", {
                    senderId: currentUser,
                    receiverId: participant.id,
                    meetingId: null,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertCalling;
