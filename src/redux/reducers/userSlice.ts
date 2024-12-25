import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState: {
        updateProfile: {
            isFetching:false,
            currentUser:null,
            error:false,
        },
        findUserByName: {
            isFetching:false,
            targetUsers: [],
            error:false,
        },
        tabInCommunitiyPage:0,
    },
    reducers: {
        updateProfileStart: (state)=>{
            state.updateProfile.isFetching = true;
        },
        updateProfileSuccess: (state, action)=> {
            state.updateProfile.isFetching = false;
            state.updateProfile.currentUser = action.payload;
        },
        updateProfileFail: (state)=>{
            state.updateProfile.isFetching = false;
            state.updateProfile.error = true;
        },
        findUserStart:(state)=> {
            state.findUserByName.isFetching = true;
        },
        findUserSuccess:(state, action)=> {
            state.findUserByName.isFetching = false;
            state.findUserByName.targetUsers = action.payload;
        },
        findUserFail:(state)=>{
            state.findUserByName.isFetching = false;
            state.findUserByName.error = true;
        },
        updateTabInCommunityPage: (state, action)=> {
            state.tabInCommunitiyPage = action.payload;
        }
    }
})

export const {
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFail,
    findUserStart,
    findUserSuccess,
    findUserFail,
    updateTabInCommunityPage} = userSlice.actions;

export default userSlice.reducer;