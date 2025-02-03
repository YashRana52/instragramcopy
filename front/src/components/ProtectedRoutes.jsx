
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true }); // Redirect to login only if user is not logged in
        }
    }, [user, navigate]);

    if (!user) return null; // Prevents rendering protected content if user is not logged in

    return <>{children}</>;
};

export default ProtectedRoutes;
