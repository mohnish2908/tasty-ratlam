import { apiConnector } from "../apiconnector";
import { couponEndpoints, endpoints } from "../apis";
import { toast } from "react-hot-toast";

// const { ADD_COUPON, GET_COUPON, DEACTIVATE_COUPON, GET_ALL_COUPONS } = couponEndpoints;
const{
    ADD_COUPON,
    GET_COUPON,
    DEACTIVATE_COUPON,
    GET_ALL_COUPONS
}=couponEndpoints;


export const addCoupon = async (newCoupon,adminToken) => {
    try {
        // toast.loading("Adding Coupon...");
        console.log("link",adminToken)
        const response = await apiConnector("POST", ADD_COUPON, newCoupon, {
            Authorization:`Bearer ${adminToken}`,
        }, null);
        // console.log("code, discountPercentage, condition, description", code, discountPercentage, condition, description);
        // const response = await apiConnector("POST", ADD_COUPON,{ code, discountPercentage, condition, description },null,null);
        // toast.dismiss();
        toast.success("Coupon added successfully");
        return response;
    } catch (error) {
        console.error(error);
        toast.error(error.response.data.error); 
    } 
}

export const getAllCoupon=async()=>{
    try {
        // toast.loading("Fetching Coupons...");
        // console.log()
        const response = await apiConnector("POST", GET_ALL_COUPONS,null,null,null);
        console.log("response get all coupon",response)
        // toast.dismiss();
        return response;
    } catch (error) {
        console.error(error);
        toast.error(error.response.data.error); 
    } 
}

export const action=async (id,adminToken)=>{
    try{
        console.log("id apoi",id)
        console.log("token",adminToken.adminToken)
        const response=await apiConnector("POST",DEACTIVATE_COUPON,{id},{
            Authorization:`Bearer ${adminToken.adminToken}`},null);
        console.log("response",response)
        return response;
    }
    catch(error){
        toast.error(error.response.data.error);
    }
}

export const getCoupon=async(code)=>{
    try{
        const response=await apiConnector("POST",GET_COUPON,{code},null,null);
        // console.log("response dsfasd",response)
        return response;
    }
    catch(error){
        // console.log("error",error)
        toast.error(error?.response?.data?.error);
    }
}