import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts';
import _ from 'lodash';
const { Meta } = Card;

function Home(props) {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [allList, setAllList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pieChart, setPieChart] = useState(null);

    const barRef = useRef();
    const pieRef = useRef();

    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            setViewList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            setStarList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setAllList(res.data);

            let datas = _.groupBy(res.data, item => item.category.title);
            let myChart = Echarts.init(barRef.current);

            let option = {
                title: {
                    text: '新闻分类图示'
                },
                tooltip: {},
                legend: {
                    data: ['数量']
                },
                xAxis: {
                    data: Object.keys(datas),
                    axisLabel: {
                        rotate: 45,
                        interval: 0
                    }
                },
                yAxis: {
                    minInterval: 1
                },
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: Object.values(datas).map(item => item.length)
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

            window.onresize = () => {
                myChart.resize();
            }
        });

        return () => {//hook的return中销毁onresize事件
            window.onresize = null;
        }
    }, []);

    useEffect(()=>{
        visible && renderPie();
    }, [visible]);

    const renderPie = () => {
        let currentList = allList.filter(item=>item.author === username);
        var groupObj = _.groupBy(currentList, item=>item.category.title);

        let list = [];
        for (let key in groupObj) {
            list.push({
                name: key,
                value: groupObj[key].length
            });
        }

        let myChart;
        if (!pieChart) {
            myChart = Echarts.init(pieRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }
        var option;

        option = {
            title: {
                text: '当前用户新闻分类图示',
                subtext: '纯属虚构',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    }

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
                            <SettingOutlined key="setting" onClick={() => {setVisible(true)}} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b style={{ marginRight: '8px' }}>{region === '' ? '全球' : region}</b>
                                    {roleName}
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer title="个人新闻分类" placement="right" closable={true} onClose={() => { setVisible(false) }} visible={visible}>
                <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
            </Drawer>

            <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
        </div>
    );
}

export default Home;