import notificationService from "@/services/notificationService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

export const createNotification = createAsyncThunk('notification/create', async (request: any) => {
    try {
        return await notificationService.createNotification(request);
    } catch (error) {
        return error;
    }
})

export const getNotification = createAsyncThunk('notification/get', async (id: string) => {
    try {
        return await notificationService.getNotification(id);
    } catch (error) {
        return error;
    }
})

export const deleteNotification = createAsyncThunk('notification/delete', async (id: string) => {
    try {
        return await notificationService.deleteNotification(id);
    } catch (error) {
        return error;
    }
})

export const getAllNotification = createAsyncThunk('notification/get-all', async (data:any) => {
    try {
        return await notificationService.getAllNotification(data.currentUserId, data.page, data.size);
    } catch (error) {
        return error;
    }
})

const initialState = {
    listNotify: [] as any[],
    totalNotification: null,
    page: 0,
    statusComp: false,
    loading: false,
    isError: false,
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setStatusComp: (state, action) => {
            state.statusComp = action.payload
        },
        setListNotiff: (state, action) => {
            state.listNotify = action.payload
        },
        setPage: (state, action) => {
            state.page = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(createNotification.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNotification.rejected, (state) => {
                state.loading = false;
                state.isError = true;
            })

            .addCase(getAllNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllNotification.fulfilled, (state, action) => {
                state.loading = false;
                state.listNotify = [...state.listNotify, ...(action.payload?.listNotification || [])];
                state.totalNotification = action.payload?.totalNotification;
                state.page = action.payload?.page;
            })
            .addCase(getAllNotification.rejected, (state) => {
                state.loading = false;
                state.isError = true;
            })
    },
})

export default notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;