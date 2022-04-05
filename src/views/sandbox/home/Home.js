import React from 'react';
import { Button } from 'antd';
import axios from 'axios';

const ajax = ()=>{
    axios.get('http://localhost:5000/posts').then(res=>{
        console.log(res);
    });
}

function Home(props) {
    return (
        <div>
            <Button type="primary" onClick={ajax}>Button</Button>
        </div>
    );
}

export default Home;