import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../slices/userSlice';
// import profileReducer from '../slices/profileSlice';
// import productReducer from '../slices/productSlice';
import cartReducer from '../slices/cartSlice';
import adminReducer from '../slices/adminSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    // profile: profileReducer,
    admin: adminReducer,
    cart: cartReducer,

})

export default rootReducer;