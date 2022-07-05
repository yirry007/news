import { Button } from 'antd';
import NewsPublish from '../../../components/publish/NewsPublish';
import usePublish from '../../../components/publish/usePublish';

function Unpublished(props) {
    const {dataSource, handlePublish} = usePublish(1);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>{handlePublish(id)}}>发布</Button>}></NewsPublish>
        </div>
    );
}

export default Unpublished;