import { getAll, getTopPosts } from "@/services/postService";
import { getTopCreators } from "@/services/userService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPopularPosts = createAsyncThunk('post/getTopPosts', async (data:any) => {
    try {
        return await getTopPosts(data);
    } catch (error) {
        return error;
    }
})

export const getTopCreator = createAsyncThunk('post/getTopCreators', async () => {
    try {
        return await getTopCreators();
    } catch (error) {
        return error;
    }
})

export const getAllPosts = createAsyncThunk('post/getAll', async (data:any) => {
    try {
        return await getAll(data);
    } catch (error) {
        return error;
    }
})

const initialState = {
    topCreator: [] as any[],
    popularPosts: [] as any[],
    totalPost: null,
    allPosts: [] as any[],
    totalAllPost: null,
    page: 1,
    loading: false,
    isError: false
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPopularPosts: (state, action) => {
            state.popularPosts = action.payload
        },
        setPage: (state, action) => {
            state.page = action.payload
        },
        setAllPosts: (state, action) => {
            state.allPosts = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPopularPosts.pending, (state) => {
                state.loading = true
            })
            .addCase(getPopularPosts.fulfilled, (state, action) => {
                state.loading = false
                state.popularPosts = [...state.popularPosts, ...(action.payload?.feedPosts || [])];
                state.totalPost = action.payload?.totalSize
            })
            .addCase(getPopularPosts.rejected, (state) => {
                state.loading = false
                state.isError = true
            })

            .addCase(getTopCreator.pending, (state) => {
                state.loading = true
            })
            .addCase(getTopCreator.fulfilled, (state, action) => {
                state.loading = false
                state.topCreator = action.payload
            })
            .addCase(getTopCreator.rejected, (state) => {
                state.loading = false
                state.isError = true
            })

            .addCase(getAllPosts.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.loading = false
                state.allPosts = [...state.allPosts, ...(action.payload?.feedPosts || [])];
                state.totalAllPost = action.payload?.totalSize
            })
            .addCase(getAllPosts.rejected, (state) => {
                state.loading = false
                state.isError = true
            })
    }
})

export default postSlice.reducer;

export const postActions = postSlice.actions