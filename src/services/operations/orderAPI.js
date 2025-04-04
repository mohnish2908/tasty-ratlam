import { apiConnector } from "../apiconnector";
// import {api} from "../apis";
import {orderEndpoints} from '../apis'
import { toast } from "react-hot-toast";
const{
    GET_ALL_ORDER,
    GET_ORDER_BY_USERID,
    UPDATE_ORDER,
    GET_ORDER_BY_ID,
    BULK_ORDER,
    GET_ORDER_BY_CONTACT_NUMBER
}=orderEndpoints;

export const getOrderByUserId=async(userId)=>{
    try{
        const response=await apiConnector("POST",GET_ORDER_BY_USERID,{userId},null,null);
        // console.log("response",response);
        return response.data.order;
    }
    catch(error){
        console.error(error);
    }
}

export const getOrderByContactNumber=async(contactNumber)=>{
    try{
        const response=await apiConnector("POST",GET_ORDER_BY_CONTACT_NUMBER,{contactNumber},null,null);
        console.log("response",response);
        return response.data.order;
    }
    catch(error){
        console.log("error",error)
        toast.error("No order found with this contact number");
    }
}

export const getOrderById=async(orderId)=>{
    try{
        // console.log("a",orderId);   
        const response=await apiConnector("POST",GET_ORDER_BY_ID,{orderId},null,null);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}

export const getAllOrder=async()=>{
    try{
        // console.log("a");
        const response=await apiConnector("POST",GET_ALL_ORDER,null,null,null);
        // console.log("response",response.data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}

export const bulkOrder=async(email, firstName, lastName, message, contactNumber)=>{
    try{
        const response=await apiConnector("POST",BULK_ORDER,{email, firstName, lastName, message, contactNumber},null,null);
        // return response.data;
    }
    catch(error){
        console.error(error);
    }
}

export const updateOrder=async(orderId,trackingNumber,shippingCarrier,adminToken)=>{
    console.log("admintoken",adminToken);
    try{
        const response=await apiConnector("POST",UPDATE_ORDER,{orderId,trackingNumber,shippingCarrier},{
            Authorization:`Bearer ${adminToken}`},null);
        // return response.data;
    }
    catch(error){
        console.error(error);
    }
}