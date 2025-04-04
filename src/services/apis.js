const BASE_URL = import.meta.env.VITE_API_URL;   //deployed backend base url
// console.log("Hiii",BASE_URL);


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendOTP",
  LOGIN_API: BASE_URL + "/auth/login",
  CREATE_ADMIN_API: BASE_URL + "/auth/createAdmin",
  ADMIN_LOGIN_API: BASE_URL + "/auth/adminLogin",
}

export const productEndpoints={
  GET_PRODUCTS: BASE_URL + "/product/getAllProduct",
  GET_COMBO_PRODUCTS: BASE_URL + "/product/getAllComboProduct",
  ADD_PRODUCT: BASE_URL + "/product/addProduct",
  ADD_COMBO_PRODUCT: BASE_URL + "/product/addComboProduct",
  DELETE_PRODUCT: BASE_URL + "/product/deleteProduct",
  DELETE_COMBO_PRODUCT: BASE_URL + "/product/deleteComboProduct",
  GET_PRODUCT_BY_ID: BASE_URL + "/product/getProductById",
  GET_COMBO_PRODUCT_BY_ID: BASE_URL + "/product/getComboProductById",
  ADD_PRODUCT_REVIEW: BASE_URL + "/product/createRating",
  GET_PRODUCT_REVIEW: BASE_URL + "/product/getReviews",
}

export const couponEndpoints={
  ADD_COUPON: BASE_URL + "/coupon/createCoupon",
  GET_COUPON: BASE_URL + "/coupon/getCoupon",
  DEACTIVATE_COUPON: BASE_URL + "/coupon/deactivateCoupon",
  GET_ALL_COUPONS: BASE_URL + "/coupon/getAllCoupons",
}

export const adminEndpoints={

}

export const clientEndpoints = {
  PAYMENT_API: BASE_URL + "/payment/capturePayment",
  PAYMENT_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

export const orderEndpoints = {
  GET_ALL_ORDER: BASE_URL + "/order/getOrder",
  GET_ORDER_BY_USERID: BASE_URL + "/order/getOrderByUserId",
  UPDATE_ORDER: BASE_URL + "/order/updateOrder",
  GET_ORDER_BY_ID: BASE_URL + "/order/getOrderById",
  BULK_ORDER: BASE_URL + "/payment/bulkOrder",
  GET_ORDER_BY_CONTACT_NUMBER: BASE_URL + "/order/getOrderByContactNumber",
}