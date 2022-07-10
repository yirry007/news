import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
    const navigate = useNavigate();
    // const [collapsed, setCollapsed] = useState(false);

    const { role: {roleName}, username } = JSON.parse(localStorage.getItem('token'));

    const changeCollapsed = () => {
        //改变 state 的 isCollapsed
        //console.log(props);
        props.changeCollapsed();
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
            {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
            <div style={{ float: "right" }}>
                <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    );
}

/**
 connect(
    //mapStateToProps //使组件监听某个状态的改变
    //mapDispatchToProps //组件改变某个状态
    //以上两个connect参数会分配到props属性中
 )(被包装的组件)
 */

 const mapStateToProps = ({collapsedReducer: {isCollapsed}}) => {
    return {
        isCollapsed: isCollapsed
    }
 }

 const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type: 'change_collapsed',
            // payload: 
        }
    }
 }

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);