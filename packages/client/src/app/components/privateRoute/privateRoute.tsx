import React, { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RoutePaths } from '@/app/router/router';
import useAuth from '@/app/hooks/useAuth';

const PrivateRoute: FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={RoutePaths.SIGNIN} replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
