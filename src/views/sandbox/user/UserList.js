import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Table,
    Modal,
    Form,
    Switch
} from 'antd';
import UserForm from '../../../components/user/UserForm';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

function UserList(props) {
    const [dataSource, setDataSource] = useState([]);
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
    const [form] = Form.useForm();
    const addForm = useRef(null);
    const updateForm = useRef(null);

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));
    

    //useEffect 相当于 componentDidMount
    useEffect(() => {
        const roleObj = {
            1: 'superadmin',
            2: 'admin',
            3: 'editor'
        }

        axios.get('http://localhost:5000/users?_expand=role').then(res => {
            setDataSource(roleObj[roleId] === 'superadmin' ? res.data : [
                ...res.data.filter(item=>item.username === username),
                ...res.data.filter(item=>item.region === region && roleObj[item.roleId] === 'editor')
            ]);
        });
    }, [roleId, region, username]);

    useEffect(() => {
        axios.get('http://localhost:5000/regions').then(res => {
            setRegionList(res.data);
        });

        axios.get('http://localhost:5000/roles').then(res => {
            setRoleList(res.data);
        });
    }, []);

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            key: 'region',
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                return <span>{role.roleName}</span>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            key: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }} />
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button type="danger" shape="circle" disabled={item.default} icon={<DeleteOutlined />} onClick={() => { confirm(item) }} />
                        <Button type="primary" shape="circle" disabled={item.default} icon={<EditOutlined />} onClick={() => { handleUpdate(item) }} />
                    </div>
                );
            }
        }
    ];

    const handleUpdate = async (item) => {//async 使函数体表达式同步执行
        await setIsUpdateVisible(true);

        setIsUpdateDisabled(item.roleId === 1);

        updateForm.current.setFieldsValue(item);

        setCurrent(item);
    }

    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);

        axios.patch('http://localhost:5000/users/'+item.id, {
            roleState: item.roleState
        });
    }

    const confirm = (item) => {
        Modal.confirm({
            title: '确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteUser(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const deleteUser = (item) => {
        //当前页面同步状态 + 后端同步
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete('http://localhost:5000/users/' + item.id);
    }

    const addFormOk = () => {
        addForm.current.validateFields().then(value=>{
            //console.log(value);

            setIsAddVisible(false);
            addForm.current.resetFields();

            //post到后端，生成id，在设置 dataSource, 方便后面的删除和更新
            axios.post('http://localhost:5000/users', {
                "username": value.username,
                "password": value.password,
                "region": value.region,
                "roleId": parseInt(value.roleId),
                "roleState": true,
                "default": false,
            }).then((res)=>{
                //console.log(res.data);
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter((item)=>item.id === res.data.roleId)[0]
                }]);
            });
        }).catch((err)=>{
            console.log(err);
        });
    }

    const updateFormOk = () => {
        updateForm.current.validateFields().then(value=>{
            setIsUpdateVisible(false);

            setDataSource(dataSource.map(item=>{
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter((data)=>data.id === parseInt(value.roleId))[0]
                    };
                } else {
                    return item;
                }
            }));

            setIsUpdateDisabled(!isUpdateDisabled);

            //post到后端，生成id，在设置 dataSource, 方便后面的删除和更新
            axios.patch('http://localhost:5000/users/'+current.id, {
                "username": value.username,
                "password": value.password,
                "region": value.region,
                "roleId": parseInt(value.roleId),
            });
        }).catch((err)=>{
            console.log(err);
        });
    }

    return (
        <div>
            <Button type="primary" onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => { setIsAddVisible(false) }}
                onOk={addFormOk}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} isUpdateDisabled={true} mode={1} />
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false);
                    setIsUpdateDisabled(!isUpdateDisabled);
                }}
                onOk={updateFormOk}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} mode={2} />
            </Modal>
        </div>
    );
}

export default UserList;