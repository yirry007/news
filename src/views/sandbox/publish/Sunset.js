import { Button } from 'antd';
import NewsPublish from '../../../components/publish/NewsPublish';
import usePublish from '../../../components/publish/usePublish';

function Sunset(props) {
    const {dataSource, handleDelete} = usePublish(3);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button type="danger" onClick={()=>{handleDelete(id)}}>删除</Button>}></NewsPublish>
        </div>
    );
}

export default Sunset;