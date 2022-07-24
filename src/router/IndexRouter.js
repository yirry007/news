import React, { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from '../views/login/Login';
import SandBox from '../views/sandbox/SandBox';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

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
                <Route exact path="/news" element={<News />} />
                <Route exact path="/detail/:id" element={<Detail />} />
            </Routes>
        </HashRouter>
    );
}

export default IndexRouter;