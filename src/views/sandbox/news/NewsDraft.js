import React, { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Modal,
    notification
} from 'antd';
import axios from 'axios';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function NewsDraft(props) {
    const [dataSource, setDataSource] = useState([]);
    const { username } = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();

    //useEffect 相当于 componentDidMount
    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
            setDataSource(res.data);
        });
    }, [username]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id)=>{
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item)=>{
                return <a href={`#/news/preview/${item.id}`}>{title}</a>;
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category)=>{
                return category.title
            }
        },
        {
            title: '操作',
            render: (item)=>{
                return (
                    <div>
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirm(item)}} />
                        
                        <Button shape="circle" icon={<EditOutlined />} onClick={()=>{navigate(`/news/update/${item.id}`)}} />

                        <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>{handleCheck(item.id)}} />
                    </div>
                );
            }
        }
    ];

    const confirm = (item)=>{
        Modal.confirm({
            title: '确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteNews(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const deleteNews = (item)=>{
        //当前页面同步状态 + 后端同步
        setDataSource(dataSource.filter(data=>data.id !== item.id));
        axios.delete('/news/'+item.id);
    }

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {auditState: 1}).then(res=>{
            navigate('/audit/list');
            
            notification.info({
                message: '通知',
                description:
                    `您可以到${'审核列表'}中查看您的新闻`,
                placement: 'bottomRight',
            });
        });
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=>item.id} />
        </div>
    );
}

export default NewsDraft;