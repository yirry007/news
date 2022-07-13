import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Meta } = Card;

function Home(props) {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);

    const { username, region, role:{roleName} } = JSON.parse(localStorage.getItem('token'));

    useEffect(()=>{
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res=>{
            setViewList(res.data);
        })
    }, []);

    useEffect(()=>{
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res=>{
            setStarList(res.data);
        })
    }, []);

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`#/news/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`#/news/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b style={{marginRight: '8px'}}>{region === '' ? '全球' : region}</b>
                                    {roleName}
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Home;