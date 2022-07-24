import { PageHeader, Card, Col, Row, List } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';

function News(props) {
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            setList(Object.entries(_.groupBy(res.data, item=>item.category.title)));
        });
    }, []);

    return (
        <div style={{ width: '95%', margin: '0 auto' }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(items=>(
                            <Col span={8} key={items[0]}>
                                <Card title={items[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={items[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={item=><List.Item><a href={`#/detail/${item.id}`}>{item.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </div>
    );
}

export default News;