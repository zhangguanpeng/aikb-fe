import React, { useState } from 'react';
import {
    UpOutlined,
    DownOutlined,
    BulbOutlined
  } from '@ant-design/icons';
import './style.less';

const CustomCollapse = (props) => {
    const {data} = props;
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="custom-collapse-component">
            <div className="intro">
                <BulbOutlined style={{ marginRight: '10px', color: '#318CFF'}} />
                <span>{data.textIntro}</span>
                {
                    data.showCollapse && collapsed && <DownOutlined onClick={() => { setCollapsed(false) }} style={{ marginLeft: '10px', fontSize: '12px'}} />
                }
                {
                    data.showCollapse && !collapsed && <UpOutlined onClick={() => { setCollapsed(true) }} style={{ marginLeft: '10px', fontSize: '12px'}} />
                }
            </div>
            {
                data.showCollapse && !collapsed && data.textReference && (
                    <ul className="reference">
                        {
                            data.textReference.map((item, index) => (
                                <li className="reference-item" key={index}>{item.title}</li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    );
};

export default CustomCollapse;
