import React, { forwardRef, useEffect, useState } from 'react';
import {
    Form,
    Input
} from 'antd';

const UserForm = forwardRef((props, ref) => {
    const [regionDisabled, setRegionDisabled] = useState(false);

    useEffect(()=>{
        if (props.mode === 1) {//新增数据时 region 和 roleId 如果不去手动选中的话就没有值
            ref.current.setFieldsValue({
                region: props.regionList[0].value,
                roleId: props.roleList[0].id
            });
        }
    }, []);

    useEffect(() => {
        setRegionDisabled(props.isUpdateDisabled);
    }, [props.isUpdateDisabled]);

    const { roleId, region } = JSON.parse(localStorage.getItem('token'));
    const roleObj = {
        1: 'superadmin',
        2: 'admin',
        3: 'editor'
    }
    const checkRegionDisabled = (item) => {
        if (props.mode === 1) {//创建
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return item.value !== region;
            }
        } else {//更新
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        }
    }

    const checkRoleDisabled = (item) => {
        if (props.mode === 1) {//创建
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return roleObj[item.id] !== 'editor';
            }
        } else {//更新
            if (roleObj[roleId] === 'superadmin') {
                return false;
            } else {
                return true;
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={regionDisabled ? [] : [{ required: true, message: 'Please input the title of collection!'}]}
            >
                <select style={{ width: '100%', height: '36px' }} disabled={regionDisabled}>
                    {
                        props.regionList.map((item) => (
                            <option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</option>
                        ))
                    }
                </select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <select style={{ width: '100%', height: '36px' }} onChange={(e)=>{
                    setRegionDisabled(e.target.value === '1');

                    // if (e.target.value === '1') {
                    //     setRegionDisabled(true);
                    //     ref.current.setFieldsValue({
                    //         region: ''
                    //     });
                    // } else {
                    //     setRegionDisabled(false);
                    // }
                }}>
                    {
                        props.roleList.map((item) => (
                            <option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</option>
                        ))
                    }
                </select>
            </Form.Item>
        </Form>
    );
})

export default UserForm;