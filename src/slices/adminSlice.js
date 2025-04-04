import { createSlice } from "@reduxjs/toolkit";
const safeParse = (item) => {
    try {
      return JSON.parse(item) || null;
    } catch (error) {
      return null;
    }
  };
  
  const adminSlice = createSlice({
    name: "admin",
    initialState: {
      isAdmin: safeParse(localStorage.getItem("isAdmin")) || false,
      adminData: safeParse(localStorage.getItem("adminData")) || null,
      adminToken: localStorage.getItem('adminToken')? JSON.parse(localStorage.getItem('adminToken')) : null,
    },
    reducers: {
      setAdmin(state, action) {
        state.isAdmin = action.payload.isAdmin;
        state.adminData = action.payload.adminData;
  
        // Persist state in localStorage
        localStorage.setItem("isAdmin", JSON.stringify(state.isAdmin));
        localStorage.setItem("adminData", JSON.stringify(state.adminData));
      },
      clearAdmin(state) {
        state.isAdmin = false;
        state.adminData = null;
  
        // Clear from localStorage
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminData");
      },
      setAdminToken(state, value) {
        state.adminToken = value.payload;
        if (value.payload) {
          localStorage.setItem('adminToken', JSON.stringify(value.payload));
        }
        localStorage.setItem("adminToken", JSON.stringify(state.adminToken));
      },
    },
  });
  
  export const { setAdmin, clearAdmin,setAdminToken } = adminSlice.actions;
  export default adminSlice.reducer;
  