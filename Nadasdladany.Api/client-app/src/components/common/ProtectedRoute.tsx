import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../api/authService';

export const ProtectedRoute = () => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};