import { checkSessionLogin } from "@/services/userService";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Navigate, Outlet, useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

const AuthLayout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector((state:any)=> state.auth.login.currentUser);

    useEffect(()=> {
        checkSessionLogin(dispatch).then(response => {
            if (response.name) {
                toast.success("Welcome back " +response.name);
                navigate("/")
            }
        }).catch(error => {
            console.error('Error checking session login:', error);
        })
    }, [])

    return currentUser===null && (
        <>
            <section
                className="flex flex-1 justify-center items-center flex-col py-10 px-5">
                <Outlet/>
            </section>
            <img src="../../public/assets/images/engineering-1088615_1920.jpg" alt="logo" className="hidden sm:block h-screen w-1/2 object-cover bg-no-repeat"/>
        </>
    )

          
};

export default AuthLayout;