import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-particles-js';
import axios from 'axios';
import './Login.css';

function Login(props) {
    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.get('/users?username='+values.username+'&password='+values.password+'&roleState=true&_expand=role').then(res=>{
            if (res.data.length === 0) {
                message.error('用户名或密码不匹配');
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0]));
                props.set_auth(res.data[0]);
                navigate('/home');
            }
        });
    }

    return (
        <div className="login">
            <Particles height={document.documentElement.clientHeight} />
            <div className="login-wrap">
                <div className="login-title">全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;