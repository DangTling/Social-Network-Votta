import GridPostList from "@/components/GridPostList.tsx";
import { useSelector } from "react-redux";

const SavedScreen = () => {
    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    return (
        <div className="saved-container">
            <div className="flex gap-2 w-full max-w-5xl">
                <img src="../../public/assets/icons/save.svg" alt="save icon" width={36} height={36}
                     className="invert-white"/>
                <h2 className="h3-bold md:h2-bold text-left w-full">
                    Saved Posts
                </h2>
            </div>
            <ul className="w-full flex justify-center gap-9 max-w-5xl">
                <GridPostList userId={null} savedId={currentUser?.id} />
            </ul>
        </div>
    );
};

export default SavedScreen;