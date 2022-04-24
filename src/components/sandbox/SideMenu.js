import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import {
    UserOutlined
  } from '@ant-design/icons';
  import './Components.css';
import axios from 'axios';

const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const selectKeys = [location.pathname];
    const openKeys = ['/'+location.pathname.split('/')[1]]
    const [menu, setMenu] = useState([]);

    useEffect(()=>{
      axios.get('http://localhost:5000/rights?_embed=children').then(res=>{
        setMenu(res.data);
      });
    }, []);

    const { role: {rights} } = JSON.parse(localStorage.getItem('token'));

    const checkPagePermission = (item) => {
      return item.pagepermisson && rights.includes(item.key);
    }

    const renderMenu = (menuList)=>{
      return menuList.map((item)=>{
        if (item.children?.length>0 && checkPagePermission(item)) {
          return (
            <SubMenu key={item.key} icon={<UserOutlined />} title={item.title}>
              {renderMenu(item.children)}
            </SubMenu>
          );
        }

        return checkPagePermission(item) && <Menu.Item key={item.key} icon={<UserOutlined />} onClick={()=>{ navigate(item.key); }}>{item.title}</Menu.Item>
      });
    }
    
    return (
        <Sider trigger={null} collapsible collapsed={false} >
          <div style={{display:"flex", height:"100%", flexDirection:"column"}}>
            <div className="logo">全球新闻发布管理系统</div>
            <div style={{flex:"1", overflow:"auto"}}>
              <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                {renderMenu(menu)}
              </Menu>
            </div>
          </div>
        </Sider>
    );
}

export default SideMenu;