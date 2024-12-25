import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import { useDispatch, useSelector } from "react-redux";
import {  logoutAccount } from "@/services/userService";
import { toast } from "react-toastify";

const Topbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    const handleSignOut = async () => {
        const response = await logoutAccount(dispatch)
        if (response === "Log out successfully") {
            toast.success(response)
            navigate("/sign-in");
        } else {
            toast.error(response)
        }
    }

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to='/' className="flex gap-3 items-center">
                    <img src="../../public/assets/images/logo-no-background.svg" alt="Logo votta" width={130}
                         height={325}/>
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" className="shad-button_ghost" onClick={handleSignOut}>
                        <img src="../../public/assets/icons/logout.svg" alt="Logout logo"/>
                    </Button>
                    <Link to='/chat' className="flex-center ">
                        <img src='../../public/assets/icons/messenger.svg' alt="Profile image"
                             className="h-6 w-6 rounded-full"/>
                    </Link>
                    <Link to='/notifications' className="flex-center">
                        <img src='../../public/assets/icons/Bell_pin.svg' alt="Profile image"
                             className="h-6 w-6 rounded-full"/>
                    </Link>
                    <Link to='/profile' className="flex-center gap-3">
                        <img src={currentUser?.profilePic ? currentUser?.profilePic : "../../public/assets/images/profile.png"} alt="Profile image"
                             className="h-8 w-8 rounded-full"/>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Topbar;