import React, { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Tag,
    Modal,
    Switch
} from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons';

function RightList(props) {
    const [dataSource, setDataSource] = useState([]);

    //useEffect 相当于 componentDidMount
    useEffect(()=>{
        axios.get('/rights?_embed=children').then(res=>{
            setDataSource(res.data);
        });
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id)=>{
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key)=>{
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item)=>{
                return (
                    <div>
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirm(item)}} />
                        <Switch style={{marginLeft: '12px'}} checked={item.pagepermisson} defaultChecked onChange={()=>{switchMethod(item)}} disabled={item.pagepermisson === undefined} />
                    </div>
                );
            }
        }
    ];

    const switchMethod = (item)=>{
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource]);

        if (item.grade === 1) {
            axios.patch('/rights/'+item.id, {
                pagepermisson: item.pagepermisson
            });
        } else {
            axios.patch('/children/'+item.id, {
                pagepermisson: item.pagepermisson
            });
        }
    }

    const confirm = (item)=>{
        Modal.confirm({
            title: '确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteRight(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const deleteRight = (item)=>{
        //当前页面同步状态 + 后端同步
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data=>data.id !== item.id));
            axios.delete('/rights/'+item.id);
        } else {
            let list = dataSource.filter(data=>data.id === item.rightId);
            list.children = list[0].children.filter(data=>data.id !== item.id);

            setDataSource([...dataSource]);
            axios.delete('/children/'+item.id);
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />
        </div>
    );
}

export default RightList;