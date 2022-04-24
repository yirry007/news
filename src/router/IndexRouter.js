import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../views/login/Login';
import SandBox from '../views/sandbox/SandBox';

function IndexRouter(props) {
    const [auth, setAuth] = useState(localStorage.getItem('token'));

    return (
        <HashRouter>
            <Routes>
                <Route exact path="/login" element={<Login set_auth={setAuth} />} />
                <Route path="*" element={
                    auth
                    ?<SandBox />
                    :<Navigate to="/login" />}
                />
            </Routes>
        </HashRouter>
    );
}

export default IndexRouter;