import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";
import { toast } from "react-hot-toast";
import { setLoading, setToken, setContactNumber,setUser } from "../../slices/userSlice";
import { setAdmin, clearAdmin,setAdminToken } from "../../slices/adminSlice";

const { SENDOTP_API, LOGIN_API, CREATE_ADMIN_API, ADMIN_LOGIN_API } = endpoints;

export function sendOTP(data, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));
    // if (data.contactNumber) {
    //   dispatch(setContactNumber(data.contactNumber));
    // }
    try {
      const response = await apiConnector("POST", SENDOTP_API, data);
      console.log("response", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully. Check your message.");
      navigate("/verify-otp");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could not send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(data) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging In...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, data);
      console.log("response login", response.data);
      console.log("response", response.data.user.token);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      localStorage.setItem("user", JSON.stringify(response.data?.user));
      localStorage.setItem("token", JSON.stringify(response.data?.user.token));
      dispatch(setUser(response.data?.user));
      dispatch(setToken(response.data.user.token));
      console.log("We aere from after login action", response.data.user.token);
      toast.success("Login Successfully");
      localStorage.removeItem("contactNumber");
      return { payload: { success: true, token: response.data.user.token } };
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Could not login");
      return { payload: { success: false } };
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function adminLogin(data, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging In...");
    try {
      const response = await apiConnector("POST", ADMIN_LOGIN_API, data);
      console.log("admin login response", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // const { adminData } = response.data;
      const adminToken=response.data.admin.token;
      // localStorage.setItem("", JSON.stringify(true));
      localStorage.setItem("adminToken", JSON.stringify(adminToken));
      
      dispatch(setAdmin({ isAdmin: true}));
      dispatch(setAdminToken(adminToken));
      toast.success("Login Successfully");
      navigate("/admin-dashboard");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Could not login");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("contactNumber");
    dispatch(setToken(null));
    dispatch(setContactNumber(null));
    dispatch(clearAdmin());
    navigate("/");
  };
}

export function adminLogOut(navigate) {
  return async (dispatch) => {
    dispatch(setAdmin({ isAdmin: false, adminData: null }));
    navigate("/admin-login-8989866833");
  };
}