import axiosInstance from "@/apiConfig/axiosInstance";
import axios from "axios";

export const getListConversation = async (queryName: string) => {
    try {
        const result = await axiosInstance.get(`/message/conversations?queryName=${queryName}`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const getConversation = async (userChatWithId: string) => {
    try {
        const result = await axiosInstance.get(`/message/${userChatWithId}?page&pageSize=100`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const sendMessage = async (data: any) => {
    try {
        const result = await axiosInstance.post("/message", data);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const deleteMessage = async (data: any) => {
    try {
        const result = await axiosInstance.delete(`/message/delete-message?messageId=${data}`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const getMessageById = async (data: any) => {
    try {
        const result = await axiosInstance.get(`message/get-message?messageId=${data}`);
        return result?.data;
    } catch (error:any) {   
        return error.response?.data || error.message;
    }
}

export const createMeeting = async (token) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        });
    const { roomId } = await res.json();
    return roomId;
}

const conversationService = {
    getListConversation,
    getConversation,
    sendMessage,
    deleteMessage,
    getMessageById,
    createMeeting
}

export default conversationService;