import { confirmPost, getPendingPost, getPostDetailCommunity } from "@/services/communityService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPendingPosts = createAsyncThunk('community/getPendingPosts', async (data:any) => {
    try {
        return await getPendingPost(data.communityId, data.page);
    } catch (error) {
        return error;
    }
})

export const getPostInCommunity = createAsyncThunk('community/getPostInCommunity', async (data:any) => {
    try {
        return await getPostDetailCommunity(data.userId, data.page);
    } catch (error) {
        return error;
    }
})

export const confirmPosts = createAsyncThunk('community/confirmPost', async (data:any) => {
    try {
        return await confirmPost(data.postId);
    } catch (error) {
        return error;
    }
})

const initialState = {
    pendingPosts: [] as any[],
    postInCommunity: [] as any[],
    totalSizeInCommunity: 0,
    totalSize: 0,
    loading: false,
    error: false,
}

const communitySlice = createSlice({
    name: "community",
    initialState,
    reducers: {
        setPendingPosts: (state, action) => {
            state.pendingPosts = action.payload
            state.totalSize = 0
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPendingPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPendingPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingPosts = [...state.pendingPosts, ...(action.payload.feedPosts || [])];
                state.totalSize = action.payload.totalSize
            })
            .addCase(getPendingPosts.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

            .addCase(confirmPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(confirmPosts.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(confirmPosts.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })

            .addCase(getPostInCommunity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPostInCommunity.fulfilled, (state, action) => {
                state.loading = false;
                state.postInCommunity = [...state.postInCommunity, ...(action.payload.feedPosts || [])];
                state.totalSizeInCommunity = action.payload.totalSize
            })
            .addCase(getPostInCommunity.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    }
})

export default communitySlice.reducer;

export const communityActions = communitySlice.actions;