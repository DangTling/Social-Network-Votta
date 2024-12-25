import { conversationActions } from "@/redux/reducers/conversationSlice";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import ReactPlayer from "react-player";

const MeetingView = ({ currentUserId, participantIsCalling, socket, dispatch, joinStatus }) => {
  const [micStatus, setMicStatus] = useState(true);
  const [webcamStatus, setWebcamStatus] = useState(true);
  const [participant, setParticipant] = useState(null);
  const micRef = useRef(null);

  const { join, participants, leave, toggleMic, toggleWebcam } = useMeeting({
    onMeetingJoined: () => {
      dispatch(conversationActions.setJoin("joined"));
    },
    onMeetingLeft: () => {
      dispatch(conversationActions.setParticipantIsCalling(null));
      dispatch(conversationActions.setMeetingId(null));
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      join();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const participantsIds = [...participants.keys()];
    if (participantsIds.length === 2) {
      setParticipant(participantsIds[1]);
    }
    if (joinStatus === "leaved") {
      leave();
    }
  }, [participants]);

  const { webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participant);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div
      className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-[960px] h-[540px] bg-black rounded-md border-light-2 border-2 overflow-hidden
        "
    >
      {webcamOn && webcamStatus ? (
        <>
          <div>
            <ReactPlayer
              playsinline
              light={false}
              controls={false}
              muted={true}
              playing={true}
              url={videoStream}
              width={"100%"}
              height={"100%"}
              onError={(err) => console.log(err)}
            />
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
          </div>
        </>
      )  : (
        <div className="flex justify-center items-center h-full">
          <div>
            <HashLoader color="#fff" size={200} />
            <p className="text-white text-2xl text-center mt-8">Calling ...</p>
          </div>
        </div>
      )}
      <div className="absolute w-full bottom-5 gap-8 flex  items-center justify-center">
        <button
          className={`w-16 h-16 rounded-full border-2 border-white flex items-center justify-center ${
            micStatus ? "" : "bg-red"
          }`}
          onClick={() => {
            toggleMic();
            setMicStatus(!micStatus);
          }}
        >
          {micStatus ? (
            <img
              src="../../public/assets/icons/Mic.svg"
              alt=""
              className="object-cover w-8 h-8"
            />
          ) : (
            <img
              src="../../public/assets/icons/Mic_fill.svg"
              alt=""
              className="object-cover w-8 h-8"
            />
          )}
        </button>
        <button
          className="w-16 h-16 rounded-full bg-red flex items-center justify-center"
          onClick={() => {
            socket.emit("leaveMeeting", {
              meetingId: null,
              receiverId: participantIsCalling.id,
              senderId: currentUserId,
            });
            leave();
          }}
        >
          <img
            src="../../public/assets/icons/Phone_fill.svg"
            alt=""
            className="object-cover w-8 h-8"
          />
        </button>
        <button
          className={`w-16 h-16 rounded-full border-2 border-white flex items-center justify-center ${
            webcamStatus ? "" : "bg-red"
          }`}
          onClick={() => {
            toggleWebcam();
            setWebcamStatus(!webcamStatus);
          }}
        >
          <img  
            src="../../public/assets/icons/Camera_fill.svg"
            alt=""
            className="object-cover w-8 h-8"
          />
        </button>
      </div>
    </div>
  );
};

export default MeetingView;
