import EditForm from "@/components/EditForm";
import { getPostDetail } from "@/services/postService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePostScreen = () => {
    const navigate = useNavigate();
    const params = useParams();
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);
    const [post, setPost] = useState<any>(null);

    useEffect(()=> {
        if (!navigator.onLine) {
            navigate('/loss-connection');
        }
        (async ()=>{
            try {
                const result = await getPostDetail(currentUser.id, params["*"] ? params["*"] : "");
                setPost(result);
            } catch (error) {
                console.log(error)
            }
        })()
    }, [params])

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img src="/assets/icons/add-post.svg" alt="add icon" width={36} height={36}/>
                    <h2 className="h3-bold md:h2-bold text-full w-full">Edit Post</h2>
                </div>
                <EditForm postId={params["*"] ? params["*"] : ""} post={post}/>
            </div>
        </div>
    );
};

export default UpdatePostScreen;