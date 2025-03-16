import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import {
    UpOutlined,
    DownOutlined,
    BulbOutlined,
    CheckCircleOutlined
  } from '@ant-design/icons';
import {Up, Down} from '@icon-park/react';
import './style.less';

const CustomCollapse = (props) => {
    const {data} = props;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="custom-collapse-component">
            <div className="intro">
                <div>
                    {
                        !data.thinking && (data.isDeepseek)? (<CheckCircleOutlined style={{ marginRight: '10px', color: '#318CFF'}} />) : (<BulbOutlined style={{ marginRight: '10px', color: '#318CFF'}} />)
                    }
                    <span>{data.textIntro}</span>
                </div>
                <div className="arrow">
                    {
                        // data.showCollapse && collapsed && <DownOutlined onClick={() => { setCollapsed(false) }} style={{ marginLeft: '10px', fontSize: '12px'}} />
                        data.showCollapse && collapsed && <Down onClick={() => { setCollapsed(false) }} theme="outline" size="18" fill="#333" />
                    }
                    {
                        // data.showCollapse && !collapsed && <UpOutlined onClick={() => { setCollapsed(true) }} style={{ marginLeft: '10px', fontSize: '12px'}} />
                        data.showCollapse && !collapsed && <Up onClick={() => { setCollapsed(true) }} theme="outline" size="18" fill="#333" />
                    }
                </div>
            </div>
            {
                !data.isDeepseek && data.showCollapse && !collapsed && data.textReference && (
                    <ul className="reference">
                        {
                            data.textReference.map((item, index) => (
                                <li className="reference-item" key={index}>{item.title}</li>
                            ))
                        }
                    </ul>
                )
            }

            {
                (data.isDeepseek) && data.showCollapse && !collapsed && data.textReference && (
                    <ul className="think">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {data.thinkText}
                        </ReactMarkdown>
                    </ul>
                )
            }
        </div>
    );
};

export default CustomCollapse;
