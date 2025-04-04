import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
    const {isAdmin} = useSelector((state) => state.admin);

    if (isAdmin) {
        return children;
    }
    else {
        return <Navigate to="/admin-login-8989866833" />
    }
}

export default AdminRoute;