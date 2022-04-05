import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    SettingOutlined
  } from '@ant-design/icons';
  import './Components.css';
import { render } from '@testing-library/react';

const { Sider } = Layout;
const { SubMenu } = Menu;

//模拟数组结构
const menuList = [
  {
    key: "/home",
    title: "首页",
    icon: <UserOutlined />
  },
  {
    key: "/user",
    title: "用户管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/user/list",
        title: "用户列表",
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: "/right",
    title: "权限管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/role/list",
        title: "角色列表",
        icon: <UserOutlined />
      },
      {
        key: "/right/list",
        title: "权限列表",
        icon: <UserOutlined />
      }
    ]
  }
];

function SideMenu(props) {
    const navigate = useNavigate();

    const renderMenu = (menuList)=>{
      return menuList.map((item)=>{
        if (item.children) {
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {renderMenu(item.children)}
            </SubMenu>
          );
        }

        return <Menu.Item key={item.key} icon={item.icon} onClick={()=>{
          navigate(item.key);
        }}>{item.title}</Menu.Item>
      });
    }
    
    return (
        <Sider trigger={null} collapsible collapsed={false} >
          <div className="logo">全球新闻发布管理系统</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {renderMenu(menuList)}
          </Menu>
        </Sider>
    );
}

export default SideMenu;