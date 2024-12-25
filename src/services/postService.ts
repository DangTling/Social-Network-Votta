import axiosInstance from "@/apiConfig/axiosInstance.ts";

export const uploadPost = async (request:any) => {
    try {
        const result = await axiosInstance.post("/post/upload-post", request);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getTopPosts = async ({page, size}:any) => {
    try {
        const result = await axiosInstance.get(`/post/popular-post?page=${page}&size=${size}`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getFeed = async (page:number) => {
    try {
        const result = await axiosInstance.get(`/post/feed?page=${page}&pageSize=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getFeedForCommunity = async (page:number) => {
    try {
        const result = await axiosInstance.get(`/post/feed-for-community?page=${page}&pageSize=10`);
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const seeAllPostOfUser = async (targetId:string) => {
    try {
        const result= await axiosInstance.get(`/post/see-all-post/${targetId}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message;
    }
}

export const getPostDetail = async (targetId:string, postId:string) => {
    try {
        const result = await axiosInstance.get(`/post/${targetId}/${postId}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const editPost = async (postId:string, requestBody:any) => {
    try {
        const result = await axiosInstance.put(`/post/edit-post/${postId}`, requestBody)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const interactPost = async (postId:string, targetUserId:string) => {
    try {
        const result = await axiosInstance.post(`/post/interact-post/${postId}?targetUserId=${targetUserId}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const commentPost = async (postId:string, targetUserId:string, requestBody:any) => {
    try {
        const result = await axiosInstance.post(`/post/reply-post/${postId}?targetUserId=${targetUserId}`, requestBody)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const deletePost = async (postId:string, targetUserId:string) => {
    try {
        const result = await axiosInstance.delete(`/post/delete-post/${postId}?targetUserId=${targetUserId}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const savePost = async (postId:string) => {
    try {
        const result = await axiosInstance.post(`/post/save/${postId}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const getSavedPosts = async (page:number) => {
    try {
        const result = await axiosInstance.get(`/post/save?page=${page}&pageSize=10`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}

export const getAll = async ({query, page, size}) => {
    try {
        const result = await axiosInstance.get(`/post/get-all?query=${query}&page=${page}&size=${size}`)
        return result?.data
    } catch (error:any) {
        return error.response?.data || error.message
    }
}