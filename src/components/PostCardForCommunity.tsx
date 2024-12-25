import {Link} from "react-router-dom";
import PostStatus from "@/components/PostStatus.tsx";
import {useState} from "react";
import Lottie from "react-lottie";
import love from "../../public/assets/lotties/new-heart.json"
import {useSelector} from "react-redux";
import {interactPost} from "@/services/postService.ts";
import {toast} from "react-toastify";

const PostCardForCommunity = ({post}:any) => {
    const {createdAt} = post;
    const postDate = new Date(createdAt).toLocaleDateString();
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser)
    const [isLiked, setIsLiked] = useState(post.like.some((user:any) => user.id === currentUser?.id))
    const [likedCount, setLikedCount] = useState(post.like.length)
    const [showAnimation, setShowAnimation] = useState(false)

    const option = {
        animationData:love ,
        loop:true,
    }

    const onStatusChange = () => {
        setIsLiked(!isLiked)
        setLikedCount((prevCount:number)=>(isLiked ? prevCount - 1 : prevCount + 1))
    }

    const handleDoubleClick = () => {
        setShowAnimation(true)
        if (!isLiked) {
            const handleLikePost = async (postId:string, targetUserId:string) => {
                try {
                    const result = await interactPost(postId, targetUserId);
                    if (typeof result === "string") {
                        onStatusChange()
                    }
                } catch (error) {
                    console.error('Error interacting with post:', error);
                    toast.error('Error interacting with post');
                }
            }

            handleLikePost(post.id, post.postedBy.id)
        }
        setTimeout(()=> {
            const overlay = document.querySelector('.animation-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
            }
            setTimeout(()=>{
                setShowAnimation(false)
            }, 300)
        },2000)
    }

    return (
        <div className='post-card'>
            
            <Link to={`/community/${post?.belongsTo?.id}`} className="flex items-center gap-[0.5rem] mb-3">
                <img src="../../public/assets/icons/group.svg" alt="" loading="lazy" />
                <p className="subtle-semibold lg:small-regular">{post?.belongsTo?.name}</p>
            </Link>
    
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post?.postedBy?.username}`}>
                        <img src={post?.postedBy?.profilePic ? post?.postedBy?.profilePic : "../../public/assets/images/logo-no-background.svg"} alt="avatar user" loading="lazy"
                             className="rounded-full w-12 lg:h-12"/>
                    </Link>
                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {post?.postedBy?.username}
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular">{postDate}</p>•<p
                            className="subtle-semibold lg:small-regular">Hanoi</p>
                        </div>
                    </div>
                </div>
                <Link to='/update-post'>
                    <img src="../../public/assets/icons/edit.svg" alt="Edit icons" width={20} height={20} loading="lazy"/>
                </Link>
            </div>
            <Link to={`/posts/${post?.id}/${post?.postedBy?.id}`}>
                <div className="small-medium lg:base-medium py-5">
                    <p>{post?.caption}</p>
                    <ul className='flex gap-1 mt-2'>
                        <li className="text-light-3">#RMITGRAD24</li>
                    </ul>
                </div>
            </Link>
            <div className="post-image-container" onDoubleClick={handleDoubleClick}>
                <img src={post?.postPic ? post?.postPic : "../../public/assets/images/logo-no-background.svg"} alt="post image" loading="lazy" className="post-card_img" />
                {showAnimation && (
                    <div className="animation-overlay">
                        <Lottie options={option}/>
                    </div>
                )}
            </div>
            <PostStatus post={post} like={isLiked} count={likedCount} onStatusChange={onStatusChange}/>
        </div>
    );
};

export default PostCardForCommunity;