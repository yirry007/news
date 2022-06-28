import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
    Button,
    Steps,
    PageHeader,
    Form,
    Input,
    message,
    notification
} from 'antd';
import style from './News.module.css';
import NewsEditor from '../../../components/news/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';

const { Step } = Steps;

function NewsUpdate(props) {
    const [current, setCurrent] = useState(0);
    const [categories, setCategories] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState('');

    const {id} = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('token'));

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res);
                setCurrent(current + 1);
            }).catch(err => {
                console.log(err);
            });

            return false;
        }

        if (current === 1 && (content === '' || content.trim() === '<p></p>')) {
            message.error('新闻内容不能为空');
            return false;
        }

        console.log(formInfo, content);
        setCurrent(current + 1);
    }

    const handlePrev = () => {
        setCurrent(current - 1);
    }

    const handleSave = (auditState) => {
        axios.patch(`/news/${id}`, {
            ...formInfo,
            'content': content,
            'auditState': auditState
        }).then(res => {
            navigate(auditState === 0 ? '/news/draft' : '/audit/list');

            notification.info({
                message: '通知',
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: 'bottomRight',
            });
        });
    }

    const NewsForm = useRef(null);

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategories(res.data);
        });
    }, []);

    useEffect(()=>{
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
            let {title, categoryId, content} = res.data;
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            });

            setContent(content);
        });
    }, []);

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={()=>{navigate(-1)}}
                subTitle=""
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>

            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.hidden}>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your title!' }]}
                        >
                            <select style={{ width: '100%', height: '36px' }}>
                                <option value="" key="0">请选择新闻分类</option>
                                {
                                    categories.map((item) => (
                                        <option value={item.id} key={item.id}>{item.title}</option>
                                    ))
                                }
                            </select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.hidden}>
                    <NewsEditor getContent={(value) => { setContent(value) }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.hidden}>3333</div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {current === 2 &&
                    <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>}
                {current > 0 && <Button onClick={handlePrev}>上一步</Button>}
            </div>
        </div>
    );
}

export default NewsUpdate;