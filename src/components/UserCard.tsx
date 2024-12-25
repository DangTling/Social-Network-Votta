import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import { useSelector } from "react-redux";


const UserCard = (props: {
    username: string,
    name:string,
    profilePic:string,
}) => {
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    return (
        <Link to={`/profile/${props.username}`} className="user-card">
            <img src={props.profilePic ? props.profilePic : "../../public/assets/images/defaultImage.png"} alt="creator" className="rounded-full w-14 h-14"/>
            <div className="flex-center flex-col gap-1">
                <p className="base-medium text-light-1 text-center line-clamp-1">{props.name}</p>
                <p className="small-medium text-light-3 text-center line-clamp-1">@{props.username}</p>
            </div>
            {currentUser.username != props.username && (
                <Button type="button" size="sm" className="shad-button_primary px-5" >Add Friend</Button>
            )}
        </Link>
    );
};

export default UserCard;