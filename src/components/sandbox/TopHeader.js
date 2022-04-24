import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;

function TopHeader(props) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const { role: {roleName}, username } = JSON.parse(localStorage.getItem('token'));

    const changeCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const menu = (
        <Menu>
            <Menu.Item key="manager">
                {roleName}
            </Menu.Item>
            <Menu.Item danger key="logout" onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
            }}>退出</Menu.Item>
        </Menu>
      );

    return (
        <Header className="site-layout-background" style={{ padding: "0 16px" }}>
            {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
            <div style={{ float: "right" }}>
                <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    );
}

export default TopHeader;