import {Routes, Route} from 'react-router-dom'
import SignInScreen from "./views/SignInScreen.tsx";
import HomePageScreen from "./views/HomePageScreen.tsx";
import AuthLayout from "@/layouts/AuthLayout.tsx";
import SignUpScreen from "@/views/SignUpScreen.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";
import CreatePostScreen from "@/views/CreatePostScreen.tsx";
import PostDetailScreen from "@/views/PostDetailScreen.tsx";
import PeopleScreen from "@/views/PeopleScreen.tsx";
import ExploreScreen from "@/views/ExploreScreen.tsx";
import SavedScreen from "@/views/SavedScreen.tsx";
import ProfileScreen from "@/views/ProfileScreen.tsx";
import UpdateProfile from "@/views/UpdateProfileSscreen.tsx";
import DisconnectScreen from './views/DisconnectScreen.tsx';
import CommunityDetailScreen from './views/CommunityDetailScreen.tsx';
import UpdatePostScreen from './views/UpdatePostScreen.tsx';
import ChatPageScreen from './views/ChatPageScreen.tsx';
import ChatDetailScreen from './views/ChatDetailScreen.tsx';
import { useEffect, useState } from 'react';
import NotificationScreen from './views/NotificationScreen.tsx';
import CreateCommunityScreen from './views/CreateCommunityScreen.tsx';
import DashboardScreen from './views/DashboardScreen.tsx';


function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <main className="flex h-screen  overflow-x-hidden overflow-y-hidden">
                <Routes>     
                    <Route element={<AuthLayout/>}>
                        <Route path="/sign-in" element={<SignInScreen/>}/>
                        <Route path="/sign-up" element={<SignUpScreen/>}/>
                    </Route>

                    <Route element={<RootLayout/>}>
                        <Route index element={<HomePageScreen/>}/>
                        <Route path='/create-post/*' element={<CreatePostScreen/>}/>
                        <Route path='/edit-post/*' element={<UpdatePostScreen/>}/>
                        <Route path='/posts/*' element={<PostDetailScreen/>}/>
                        <Route path='/all-users' element={<PeopleScreen/>}/>
                        <Route path='/explore' element={<ExploreScreen/>}/>
                        <Route path='/saved' element={<SavedScreen/>}/>
                        <Route path='/profile/*' element={<ProfileScreen/>}/>
                        <Route path='/update-profile' element={<UpdateProfile/>} />
                        <Route path='/people' element={<PeopleScreen/>}/>
                        <Route path='/create-community' element={<CreateCommunityScreen />}/>
                        <Route path='/community/*' element={<CommunityDetailScreen/>}/>
                        <Route path='/chat' element={<ChatPageScreen/>}/>
                        <Route path='/chat/*' element={isMobile ?  <ChatDetailScreen/> : <ChatPageScreen/>}/>
                        <Route path='/notifications' element={isMobile && <NotificationScreen />} />
                        <Route path='/settings' element={<DashboardScreen />} />
                    </Route>
                   
                    <Route path='/loss-connection' element={<DisconnectScreen />} />
                </Routes>
            </main>

        </>
    );
}

export default App;