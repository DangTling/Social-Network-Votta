import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import { useSelector } from "react-redux";
import { useState } from "react";


const CommunityCard = (props: {
    totalMembers: string,
    name:string,
    profilePic:string,
    members:any,
    id:any
}) => {
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);
    const [showMembers, setShowMembers] = useState(props.members.slice(0,5));
    

    return (
        <Link to={`/community/${props.id}`} className="user-card relative" style={{paddingLeft:"0",paddingRight:"0", paddingTop:"0", overflow:"hidden", gap:"0.5rem", paddingBottom:"0.5rem"}}>
            <section className="w-full h-[117px] mb-3">
                <img src={props.profilePic ? props.profilePic : "../../public/assets/images/defaultImage.png"} alt="creator" className="object-cover h-[100%] w-full"/>
            </section>
            <section className="flex absolute justify-center items-center">
                {
                    showMembers.map((member:any, index:any)=>(
                        <section className="rounded-full w-10 h-10 bg-black" style={{zIndex:20-index, translate:-12*(index-Math.floor(showMembers.length/2))}} key={index}>
                            <img src={member ? member.profilePic : "../../public/assets/images/defaultImage.png"} alt="creator" style={{objectFit:"cover", width:"36px", height:"36px", borderRadius:"999px", marginLeft:"2px", marginTop:"2px"}}/>
                        </section>
                    ))
                }
            
            </section>
            <div className="flex-center flex-col gap-1 mt-1">
                <p className="base-medium text-light-1 text-center line-clamp-1">{props.name}</p>
                <p className="small-medium text-light-3 text-center line-clamp-1">{props.totalMembers} Members</p>
            </div>
            {currentUser.username != props.totalMembers && (
                <Button type="button" size="sm" className="shad-button_primary px-5 h-[32px]" >Join</Button>
            )}
        </Link>
    );
};

export default CommunityCard;