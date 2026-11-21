import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

//if the user is logged in user can't go to login page unless user logout, so this file is for that only if the Auth token
//exist then user will be redircted to store page.
const GuestRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/stores" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;