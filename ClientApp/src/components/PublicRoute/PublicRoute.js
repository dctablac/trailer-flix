import React from "react";
import { 
    Navigate, 
    Outlet, 
    useOutletContext 
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTE } from "../../text";

export default function PublicRoute() {
    const { currentUser } = useAuth();
    const outletContext = useOutletContext();

    return !currentUser ? <Outlet context={outletContext} /> : <Navigate to={ROUTE.BROWSE} />
}