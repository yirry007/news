import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tree } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

function RoleList(props) {
    const [dataSource, setDataSource] = useState([]);
    const [rightList, setRightList] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    //useEffect 相当于 componentDidMount
    useEffect(() => {
        axios.get('/roles').then(res => {
            setDataSource(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setRightList(res.data);
        });
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirm(item) }} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                            setIsModalVisible(true);
                            setCurrentRights(item.rights);
                            setCurrentId(item.id);
                        }} />
                    </div>
                );
            }
        }
    ];

    const confirm = (item) => {
        Modal.confirm({
            title: '确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteRole(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const deleteRole = (item) => {
        //当前页面同步状态 + 后端同步
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete('/roles/' + item.id);
    }

    const handleOk = (item) => {
        handleCancel();

        //同步dataSource
        setDataSource(dataSource.map((item)=>{
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item;
        }))

        axios.patch('/roles/'+currentId, {
            rights: currentRights
        });
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onCheck = (checkedKeys, info) => {
        setCurrentRights(checkedKeys.checked);
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    );
}

export default RoleList;