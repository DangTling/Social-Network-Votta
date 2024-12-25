import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        register: {
            success:false,
            isFetching: false,
            error:false,
        },
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
        },
        registerFail: (state) => {
            state.register.isFetching = false;
            state.register.success = false;
            state.register.error = true;
        },
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess:(state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
        },
        loginFail:(state)=>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart:(state)=>{
            state.login.isFetching = true;
        },
        logoutSuccess: (state)=> {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFail: (state)=> {
            state.login.error = true;
            state.login.isFetching = false;
        }
    },
})

export const {registerStart,
    registerSuccess,
    registerFail,
    loginStart,
    loginSuccess,
    loginFail,
    logoutStart,
    logoutSuccess,
    logoutFail}  = authSlice.actions;

export default authSlice.reducer;