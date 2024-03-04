/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useState, useContext } from 'react';
import { Button, Input, Space, Spin } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Store from './store';

import './style.less';

const KnowledgeSearchPage = () => {
	const [searchText, setSearchText] = useState('');

	const pageStore = useContext(Store);
	const { knowledgeData, fetchKnowledgeData, loading } = pageStore;

	const handleInputChange = (e) => {
		setSearchText(e.target.value);
	};

	const getSearchAnswer = () => {
		const documentIds = [];
		fetchKnowledgeData(documentIds, searchText);
	};

	console.log('knowledgeData', knowledgeData);

	return (
		<div className="page-knowledge-search">
			<Space.Compact size="large" style={{ width: '100%' }}>
				<Input placeholder="请输入要检索的内容" onChange={handleInputChange} />
				<Button type="primary" onClick={getSearchAnswer}>
					发送
				</Button>
			</Space.Compact>
			<div className="knowledge-content">
				<div className="left">
					{
						knowledgeData.map((knowledgeItem) => (
							<div>{knowledgeItem.content}</div>
						))
					}
				</div>
				{
					knowledgeData[0] && knowledgeData[0].reference && knowledgeData[0].reference.length > 0 && (
						<div className="right">
							<div className="list-area">
								{
									toJS(knowledgeData).map((knowledgeItem, index) => (
										<div className='item' key={index}>
											<div className='head'>
												<div className='text1'>{`检索文档片段${index+1}`}</div>
												<div>
													<span className='text1'>文档：</span>
													{
														knowledgeItem.reference.map((documentItem, index) => (
															<a key={index} href={documentItem.downloadUrl}>{documentItem.title}</a>
														))
													}
												</div>
											</div>
											<div className='desc text2'>
												{knowledgeItem.content}
											</div>
										</div>
									))
								}
							</div>
							{/* <div className="page-area">d</div> */}
						</div>
					)
				}
				
			</div>
			{
				loading && (
					<div className='page-loading'>
						<Spin spinning tip="我正在思考问题答案，请主人稍等~" size='large' fullscreen>
							<div className='content'> </div>
						</Spin>
					</div>
				)
			}
		</div>
	);
};

export default observer(KnowledgeSearchPage);
