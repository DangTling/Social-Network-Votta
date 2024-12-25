import {
    loginFail,
    loginStart,
    loginSuccess, logoutFail, logoutStart, logoutSuccess,
    registerFail,
    registerStart,
    registerSuccess
} from "@/redux/reducers/authSlice.ts";
import { NavigateFunction} from "react-router-dom";
import {AppDispatch} from "@/redux/store.ts";
import axiosInstance from "@/apiConfig/axiosInstance.ts";
import {
    findUserFail,
    findUserStart, findUserSuccess,
    updateProfileFail,
    updateProfileStart,
    updateProfileSuccess
} from "@/redux/reducers/userSlice.ts";


export const registerUser = async (request: { name: string; email: string; username: string; password: string; dob: Date; }, dispatch:AppDispatch, navigate:NavigateFunction) => {
    dispatch(registerStart());
    try {
        const newUser = await axiosInstance.post("/user/sign-up", request);
        if (newUser) {
            dispatch(registerSuccess());
            navigate("/sign-in");
        }
        return newUser;
    } catch (error:any) {
        dispatch(registerFail());
        return error.response?.data || error.message;
    }
}

export const loginAccount = async (request: {email: string, password:string}, dispatch:AppDispatch, navigate:NavigateFunction)=> {
    dispatch(loginStart());
    try {
        const result = await axiosInstance.post("/user/sign-in", request);
        if (typeof result.data != "string" && result) {
            dispatch(loginSuccess(result.data));
            navigate("/");
        }
        return result.data;
    } catch (err:any) {
        dispatch(loginFail());
        return err.response?.data || err.message;
    }
}

export const logoutAccount = async ( dispatch:AppDispatch) => {
    dispatch(logoutStart());
    try {
        const result = await axiosInstance.post("/user/sign-out");
        if (result) {
            dispatch(logoutSuccess());
        }
        return result?.data;
    } catch (err:any) {
        dispatch(logoutFail());
        return err.response?.data || err.message;
    }
}

export const updateProfile = async (targetId:string, request:{ username: string; name:string; email: string; dob: Date; password: string; profilePic: string; bio: string}, dispatch:AppDispatch, navigate:NavigateFunction) => {
    dispatch(updateProfileStart());
    try {
        const result = await axiosInstance.put(`/user/update-profile/${targetId}`, request);
        if (result) {
            dispatch(updateProfileSuccess(result.data))
            dispatch(loginSuccess(result.data))
            navigate("/profile")
        }
        return result?.data;
    } catch(error:any) {
        dispatch(updateProfileFail());
        return error.response?.data || error.message;
    }
}

export const findUserByName = async (targetName:string, dispatch:AppDispatch) => {
    dispatch(findUserStart())
    try {
        const result = await axiosInstance.get(`/user/find/${targetName}`)
        if (typeof result.data != "string") {
            dispatch(findUserSuccess(result.data.body))
        }
        return result?.data?.body
    } catch (err:any) {
        dispatch(findUserFail())
        return err.response?.data || err.message;
    }
}

export const findUserById = async (targetId:string) => {
    try {
        const result = await axiosInstance.get(`/user/find-by-id/${targetId}`)
        return result?.data
    } catch (err:any) {
        return err.response?.data || err.message;
    }
}

export const sendFollowRequest = async (targetId:string, userId:string) => {
    try {
        const result = await axiosInstance.post(`/user/follow/request/${targetId}?userId=${userId}`);
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const acceptFollowRequest = async (targetId:string, userId:string) => {
    try {
        const result = await axiosInstance.post(`/user/follow/accept/${targetId}?userId=${userId}`);
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const denyFollowRequest = async (targetId:string, userId:string) => {
    try {
        const result = await axiosInstance.post(`/user/follow/deny/${targetId}?userId=${userId}`);
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const unFollow = async (targetId:string, userId:string) => {
    try {
        const result = await axiosInstance.post(`/user/unfollow/${targetId}?userId=${userId}`);
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const removeFollower = async (targetId:string, userId:string) => {
    try {
        const result = await axiosInstance.post(`/user/delete-follower/${targetId}?userId=${userId}`);
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const checkSessionLogin =async (dispatch:AppDispatch) => {
    dispatch(loginStart());
    try {
        const result = await axiosInstance.get("/user/authenticate");
        if (typeof result.data != "string" && result) {
            dispatch(loginSuccess(result.data));
        }
        return result?.data;
    } catch (err:any) {
        dispatch(loginFail());
        return err.response?.data || err.message;
    }
}

export const getTopCreators = async () => {
    try {
        const result = await axiosInstance.get("/post/top-creator");
        return result?.data;
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getAll = async ({page}) => {
    try {
        const result = await axiosInstance.get(`/user/get-all?page=${page}&size=10`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const deleteUser = async (id:string) => {
    try {
        const result = await axiosInstance.get(`/user/delete?userId=${id}`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}