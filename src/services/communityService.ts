import axiosInstance from "@/apiConfig/axiosInstance";

export const createCommunity = async (data:any) => {
    try {
        const result = await axiosInstance.post(`/community/create-community`, data);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getFeedForCommunity = async (page:number) => {
    try {
        const result = await axiosInstance.get(`/community/feed?page=${page}&pageSize=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getTopCommunity = async () => {
    try {
        const result = await axiosInstance.get(`/community/top-community`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getMyCommunities = async () => {
    try {
        const result = await axiosInstance.get(`/community/my-communities`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getFeedMyCommunities = async (page:number) => {
    try {
        const result = await axiosInstance.get(`/community/feed-for-my-communities?page=${page}&pageSize=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getCommunityDetail = async (targetId:string) => {
    try {
        const result = await axiosInstance.get(`/community/${targetId}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getPostDetailCommunity = async (targetId:string, page:number) => {
    try {
        const result = await axiosInstance.get(`/community/post-in-community/${targetId}?page=${page}&pageSize=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const confirmPost = async (postId:string) => {
    try {
        const result = await axiosInstance.get(`/community/confirm-post?postId=${postId}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const joinCommunity = async (targetId:string) => {
    try {
        const result = await axiosInstance.post(`/community/join-community/${targetId}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const leaveCommunity = async (targetId:string) => {
    try {
        const result = await axiosInstance.post(`/community/leave-community/${targetId}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const interactJoinRequest = async (targetId:string, pendingId:string, type:string) => {
    try {
        const result = await axiosInstance.post(`/community/interact-request/${targetId}?pendingId=${pendingId}&type=${type}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const uploadPostInCommunity = async (targetId:string, data:any) => {
    try {
        const result = await axiosInstance.post(`/community/upload-post/${targetId}`, data);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getPendingPost = async (communityId:string, page:number) => {
    try {
        const result = await axiosInstance.get(`/community/get-pending-post?communityId=${communityId}&page=${page}&size=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}