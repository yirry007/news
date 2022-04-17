import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SideMenu from '../../components/sandbox/SideMenu';
import TopHeader from '../../components/sandbox/TopHeader';
import Home from './home/Home';
import UserList from './user/UserList';
import RoleList from './right/RoleList';
import RightList from './right/RightList';
import NoPermission from './nopermission/NoPermission';
import './SandBox.css';
import { Layout } from 'antd';

const { Content } = Layout;

function SandBox(props) {
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    overflow: 'auto'
                    }}
                >
                    <Routes>
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/user/list" element={<UserList />} />
                        <Route exact path="/role/list" element={<RoleList />} />
                        <Route exact path="/right/list" element={<RightList />} />
                        <Route exact path="/" element={<Navigate to="/home" />} />
                        <Route path="*" element={<NoPermission />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default SandBox;