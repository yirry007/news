import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../../views/sandbox/home/Home';
import UserList from '../../views/sandbox/user/UserList';
import RoleList from '../../views/sandbox/right/RoleList';
import RightList from '../../views/sandbox/right/RightList';
import NewsAdd from '../../views/sandbox/news/NewsAdd';
import NewsDraft from '../../views/sandbox/news/NewsDraft';
import NewsCategory from '../../views/sandbox/news/NewsCategory';
import NewsPreview from '../../views/sandbox/news/NewsPreview';
import NewsUpdate from '../../views/sandbox/news/NewsUpdate';
import Audit from '../../views/sandbox/audit/Audit';
import AuditList from '../../views/sandbox/audit/AuditList';
import Unpublished from '../../views/sandbox/publish/Unpublished';
import Published from '../../views/sandbox/publish/Published';
import Sunset from '../../views/sandbox/publish/Sunset';
import NoPermission from '../../views/sandbox/nopermission/NoPermission';
import axios from 'axios';
import { Spin } from 'antd';
import { connect } from 'react-redux';

const localRouteMap = {
    '/home': <Home />,
    '/user/list': <UserList />,
    '/role/list': <RoleList />,
    '/right/list': <RightList />,
    '/news/add': <NewsAdd />,
    '/news/draft': <NewsDraft />,
    '/news/category': <NewsCategory />,
    '/news/preview/:id': <NewsPreview />,
    '/news/update/:id': <NewsUpdate />,
    '/audit/audit': <Audit />,
    '/audit/list': <AuditList />,
    '/publish/unpublished': <Unpublished />,
    '/publish/published': <Published />,
    '/publish/sunset': <Sunset />,
};

function NewsRouter(props) {
    const [routeList, setRouteList] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res=>{
            setRouteList([...res[0].data, ...res[1].data]);
        });
    }, []);

    const checkRoute = (item) => {
        return localRouteMap[item.key] && (item.pagepermisson === 1 || item.routepermisson === 1);
    }

    const {role: {rights}} = JSON.parse(localStorage.getItem('token'));
    const checkUserPermission = (item) => {
        return rights.includes(item.key);
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            <Routes>
                {
                    routeList.map(item=>{
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route exact path={item.key} key={item.key} element={localRouteMap[item.key]} />
                        }
                    })
                }

                <Route exact path="/" element={<Navigate to="/home" />} />
                {
                    routeList.length > 0 && <Route path="*" element={<NoPermission />} />
                }
            </Routes>
        </Spin>
        
    );
}

const mapStateToProps = ({loadingReducer: {isLoading}}) => {
    return {
        isLoading: isLoading
    }
 }

export default connect(mapStateToProps)(NewsRouter);