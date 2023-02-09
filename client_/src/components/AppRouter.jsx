import React, {Suspense} from 'react';
import {Navigate, Route, Routes} from "react-router-dom"
import {adminRoutes, customerRoutes, masterRoutes, publicRoutes} from "../routes";
import {ROLE_LIST} from "../store/UserStore";
import {useSelector} from "react-redux";

const AppRouter = () => {
    const user = useSelector(state => state.user)
    return (
        <Suspense fallback={""}>
            <Routes>
                {user.userRole === ROLE_LIST.ADMIN && adminRoutes.map(({path, Component}) => <Route key={path}
                                                                                                    path={path}
                                                                                                    element={
                                                                                                        <Component/>}
                                                                                                    exact/>)}
                {user.userRole === ROLE_LIST.MASTER && user.isAuth && user.user.isActivated && masterRoutes.map(({
                                                                                                                     path,
                                                                                                                     Component
                                                                                                                 }) =>
                    <Route
                        key={path} path={path} element={<Component/>} exact/>)}
                {user.userRole === ROLE_LIST.CUSTOMER && user.isAuth && user.user.isActivated && customerRoutes.map(({
                                                                                                                         path,
                                                                                                                         Component
                                                                                                                     }) =>
                    <Route
                        key={path} path={path} element={<Component/>} exact/>)}

                {publicRoutes.map(({path, Component}) => <Route key={path} path={path} element={<Component/>} exact/>)}
                <Route
                    path="*"
                    element={<Navigate to="/"/>}
                />
            </Routes>
        </Suspense>);
};

export default AppRouter;