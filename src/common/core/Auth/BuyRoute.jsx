import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setRedirectPath } from "../../../slices/userSlice";

const BuyRoute = ({ children }) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user?.token) {
      // Store the current path before redirecting
      dispatch(setRedirectPath(location.pathname));
      navigate("/login", { replace: true }); // Avoid history stack issue
    }
  }, [user, navigate, dispatch, location]);

  return user?.token ? children : null;
};

export default BuyRoute;
