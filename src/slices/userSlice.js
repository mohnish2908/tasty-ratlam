//this slice is not in use

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    contactNumber: localStorage.getItem('contactNumber')? JSON.parse(localStorage.getItem('contactNumber')) : null,
    loading: false,
    token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null,
    redirectPath: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
            if (value.payload) {
                localStorage.setItem('user', JSON.stringify(value.payload));
            }
            else {
                localStorage.removeItem('user');
            }
        },
        setContactNumber(state, value) {
            state.contactNumber = value.payload;
            if(value.payload){
                localStorage.setItem('contactNumber', JSON.stringify(value.payload));
            }
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
            if (value.payload) {
                localStorage.setItem('token', JSON.stringify(value.payload));
            }
            else {
                localStorage.removeItem('token');
            }
        },
        setRedirectPath(state, value) {
            state.redirectPath = value.payload;
        },
    },
});

export const { setContactNumber, setLoading, setToken, setRedirectPath,setUser } = userSlice.actions;
export default userSlice.reducer;