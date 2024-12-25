import axiosInstance from "@/apiConfig/axiosInstance"

export const createNotification = async (request: any) => {
    try {
        const res = await axiosInstance.post('/notification', {
            ownerId: request.ownerId,
            content: request.content,
            affectedUserId: request.affectedUserId,
            affectedUserPic: request.affectedUserPic,
            affectedName: request.affectedName,
            affectedUsername: request.affectedUsername,
            postPic: request.postPic,
            postId: request.postId
        })
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getNotification = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/notification?id=${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteNotification = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/notification?id=${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getAllNotification = async (currentUserId: string, page: number, size: number) => {
    try {
        const res = await axiosInstance.get(`/notification/get-all?ownerId=${currentUserId}&page=${page}&size=${size}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

const notificationService = { createNotification, getNotification, deleteNotification, getAllNotification };
export default notificationService;