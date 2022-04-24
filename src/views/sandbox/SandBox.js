import React from 'react';
import SideMenu from '../../components/sandbox/SideMenu';
import TopHeader from '../../components/sandbox/TopHeader';
import './SandBox.css';
import { Layout } from 'antd';
import NewsRouter from '../../components/sandbox/NewsRouter';

const { Content } = Layout;

function SandBox(props) {
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    overflow: 'auto'
                    }}
                >
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>
    );
}

export default SandBox;