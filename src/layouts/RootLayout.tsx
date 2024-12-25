import Topbar from "@/components/Topbar.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Bottombar from "@/components/Bottombar.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkSessionLogin } from "@/services/userService";
import { toast } from "react-toastify";
import CallComponent from "@/components/CallComponent";
import AlertCalling from "@/components/AlertCalling";
import { useSocket } from "@/components/SocketContext";
import { useCallSocket } from "@/hooks/UseCallSocket";
import { useNotificationSocket } from "@/hooks/UseNotificationSocket";
import { getAllNotification } from "@/redux/reducers/notificationSlice";
import { getTopCreator } from "@/redux/reducers/postSlice";

const RootLayout = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const currentUser = useSelector((state: any) => state.auth.login.currentUser);
  const { meetingId, participantIsCalling, callStatus, joinStatus } = useSelector((state:any)=> state.conversation);
  const { statusComp, listNotify, loading, totalNotification } = useSelector((state: any) => state.notification);
  const [page, setPage] = useState(0);

  const authCallToken = import.meta.env.VITE_AUTH_TOKEN_VIDEOSDK;

  const query = {
    currentUserId: currentUser?.id,
    page: page,
    size: 5
  }

  useEffect(() => {
    checkSessionLogin(dispatch)
      .then((response) => {
        if (response.name) {
          toast.success("Welcome back " + response.name);
          navigate("/");
          dispatch(getAllNotification({
            ...query,
            currentUserId: response.id
          }))
        } else {
          navigate("/loss-connection");
        }
      })
      .catch((error) => {
        console.error("Error checking session login:", error);
      });
    dispatch(getTopCreator())

  }, []);

  useEffect(() => {
    if (!navigator.onLine) {
      navigate("/loss-connection");
    }
  }, [params]);

  useNotificationSocket(socket, dispatch, currentUser);

  useCallSocket(socket, dispatch, currentUser, callStatus);

  useEffect(()=> {
    console.log("The call is starting");
  }, [meetingId, participantIsCalling])

  useEffect(()=> {
      dispatch(getAllNotification(query))
  }, [page, dispatch])

  return (
    currentUser != null && (
      <div className="w-full md:flex  overflow-x-hidden overflow-y-hidden">
        <Topbar />
        <Sidebar dispatch={dispatch} page={page} setPage={setPage} currentUser={currentUser} statusComp={statusComp} listNotify={listNotify} loading={loading} totalNotification={totalNotification}/>

        <section className="flex flex-1 h-ful  overflow-x-hidden  custom-scrollbar">
          <Outlet context={{ setPage }} />
        </section>
        {meetingId && <CallComponent meetingId={meetingId} name={currentUser?.name} currentUserId={currentUser?.id} authCallToken={authCallToken} participantIsCalling={participantIsCalling} socket={socket} dispatch={dispatch} join={joinStatus} />}
        {callStatus && <AlertCalling participant={participantIsCalling} dispatch={dispatch} socket={socket} currentUser={currentUser?.id} meetingID={callStatus.meetingId}/>}
        <Bottombar />
      </div>
    )
  );
};

export default RootLayout;
