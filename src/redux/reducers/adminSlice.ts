import { deleteUser, getAll } from "@/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllUser = createAsyncThunk('admin/getAllUser', async (request:any) => {
    try {
        const result = await getAll(request);
        return result;
    } catch (error) {
        return error;
    }
})

export const deleteAUser = createAsyncThunk('admin/deleteUser', async (request:any) => {
    try {
        const result = await deleteUser(request);
        return result;
    } catch (error) {
        return error;
    }
})

const initialState = {
    users: [] as any[],
    totalPages: 0
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUser.fulfilled, (state, action) => {
            state.users = action.payload.content;
            state.totalPages = action.payload.totalPages;
        })
    }
})

export default adminSlice.reducer