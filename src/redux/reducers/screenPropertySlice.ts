import { createSlice } from "@reduxjs/toolkit";

const screenPropertySlice = createSlice({
    name: "screenProperty",
    initialState: {
        isBlur: false,
        selectedMessage: null,
        replyPopup: null,
    },
    reducers: {
        setIsBlur: (state, action) => {
            state.isBlur = action.payload;
        },
        setSelectedMessage: (state, action) => {
            state.selectedMessage = action.payload;
        },
        setReplyPopup: (state, action) => {
            state.replyPopup = action.payload;
        }
    },
})

export const { setIsBlur, setSelectedMessage, setReplyPopup } = screenPropertySlice.actions;

export default screenPropertySlice.reducer;