import { Button } from 'antd';
import NewsPublish from '../../../components/publish/NewsPublish';
import usePublish from '../../../components/publish/usePublish';

function Published(props) {
    const {dataSource, handleSunset} = usePublish(2);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button type="danger" onClick={()=>{handleSunset(id)}}>下线</Button>}></NewsPublish>
        </div>
    );
}

export default Published;