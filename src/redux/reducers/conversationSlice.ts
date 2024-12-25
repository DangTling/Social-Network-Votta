import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import conversationService from "@/services/conversationService";

export const getConversations = createAsyncThunk('conversation/getList', async (queryName: string) => {
    try {
        return await conversationService.getListConversation(queryName);
    } catch (error) {
        return error;
    }
})

export const getDetailConversation = createAsyncThunk('conversation/getDetail', async (userId: any, thunkAPI) => {
    try {
        return await conversationService.getConversation(userId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const createMeeting = createAsyncThunk('conversation/createMeeting', async (token: any, thunkAPI) => {
    try {
        return await conversationService.createMeeting(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

const initialState = {
    list: [],
    loading: false,
    isError: false,
    message: '',
    selectedConversation: null,
    meetingId: null,
    participantIsCalling: null,
    callStatus: null,
    joinStatus: "not yet",
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setSelectedConversation: (state, action) => {
            state.loading = false
            state.selectedConversation = action.payload
        },
        clearSelectedConversation: (state) => {
            state.selectedConversation = null
        },
        setMeetingId: (state, action) => {
            state.meetingId = action.payload
        },
        setParticipantIsCalling: (state, action) => {
            state.participantIsCalling = action.payload
        },
        setCallStatus: (state, action) => {
            state.callStatus = action.payload
        },
        setJoin: (state, action) => {
            state.joinStatus = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConversations.pending, (state) => {
                state.loading = true
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(getConversations.rejected, (state) => {
                state.loading = false
                state.isError = true
            })
            
            .addCase(getDetailConversation.pending, (state) => {
                state.loading = true
            })
            .addCase(getDetailConversation.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(getDetailConversation.rejected, (state) => {
                state.loading = false
                state.isError = true
            })

            .addCase(createMeeting.pending, (state) => {
                state.loading = true
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.loading = false
                state.meetingId = action.payload
            })
            .addCase(createMeeting.rejected, (state) => {
                state.loading = false
                state.isError = true
            })
    },
})

export const conversationActions = conversationSlice.actions;

export default conversationSlice.reducer;