import {
    MeetingProvider
  } from "@videosdk.live/react-sdk";
import MeetingView from "./MeetingView";

const CallComponent = ({meetingId, name, authCallToken, currentUserId, participantIsCalling, socket, dispatch, join}) => {
  

  return (
    <MeetingProvider 
        config={{
        meetingId: meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: name
        }} 
        token={authCallToken}
    >
        <MeetingView currentUserId={currentUserId} participantIsCalling={participantIsCalling} socket={socket} dispatch={dispatch} joinStatus={join} />
    </MeetingProvider>
  )
}

export default CallComponent;