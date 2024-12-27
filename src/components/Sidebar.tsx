import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { sidebarLinks } from "@/constant.ts";
import { Button } from "@/components/ui/button.tsx";
import { logoutAccount } from "@/services/userService.ts";
import { toast } from "react-toastify";
import NotificationPopup from "./NotificationPopup";
import { notificationActions } from "@/redux/reducers/notificationSlice";
import { postActions } from "@/redux/reducers/postSlice";

const Sidebar = ({dispatch, page, setPage, currentUser, statusComp, listNotify, loading, totalNotification}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNotify =async () => {
    await dispatch(notificationActions.setStatusComp(!statusComp))
  }

  const handleSignOut = async () => {
    const response = await logoutAccount(dispatch);
    if (response === "Log out successfully") {
      toast.success(response);
      navigate("/sign-in");
    } else {
      toast.error(response);
    }
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo-no-background.svg"
            alt="logo image"
            width={170}
            height={36}
          />
        </Link>
        <Link to="/profile" className="flex gap-3 items-center">
          <img
            src={
              currentUser?.profilePic
                ? currentUser?.profilePic
                : "/assets/images/defaultImage.png"
            }
            alt="user image"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{currentUser?.name}</p>
            <p className="small-regular text-light-3">
              @{currentUser?.username}
            </p>
          </div>
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link, i) => {
            const isActive = pathname === link.route;
            if (currentUser?.role !== "admin" && link.label === "Dashboard") {
              return null
            }

            return (
              <li
                key={i}
                className={`leftsidebar-link group ${
                  isActive ? "bg-primary-500" : ""
                }`}
              >
                {link.label !== "Notifications" ? (
                  <NavLink
                    to={link.route}
                    className="flex gap-4 items-center p-4"
                    onClick={()=>{
                      dispatch(notificationActions.setStatusComp(false))
                      dispatch(postActions.setPopularPosts([]))
                      dispatch(postActions.setPage(1))
                    }}
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className="group-hover:invert-white invert-white"
                    />
                    {link.label}
                  </NavLink>
                ) : (
                  <div
                    className={`flex gap-4 items-center p-4 relative leftsidebar-link group cursor-pointer ${
                      statusComp ? "bg-primary-500" : ""
                    }`}
                    onClick={handleNotify}
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className="group-hover:invert-white invert-white"
                    />
                    {link.label}
                    {statusComp && link.label === "Notifications" && (
                      <NotificationPopup list={listNotify} setPage={setPage} page={page} loading={loading} totalNotification={totalNotification}/>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost md:mt-8"
        onClick={handleSignOut}
      >
        <img src="/assets/icons/logout.svg" alt="Logout icon" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default Sidebar;
