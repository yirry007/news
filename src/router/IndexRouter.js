import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../views/login/Login';
import SandBox from '../views/sandbox/SandBox';

function IndexRouter(props) {
    return (
        <HashRouter>
            <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route path="*" element={
                    localStorage.getItem('token')
                    ?<SandBox />
                    :<Navigate to="/login" />}
                />
            </Routes>
        </HashRouter>
    );
}

export default IndexRouter;