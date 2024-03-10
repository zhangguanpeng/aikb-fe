/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useState, useContext } from 'react';
import { Button, Input, Space, Spin } from 'antd';
import { observer } from 'mobx-react';
import Store from './store';

import './style.less';

const KnowledgeSearchPage = () => {
	// const [searchText, setSearchText] = useState('');

	const pageStore = useContext(Store);
	const { knowledgeData, fetchKnowledgeData, loading, searchText } = pageStore;

	const handleSearchTextChange = (e) => {
		pageStore.searchText = e.target.value;
	}

	const getSearchAnswer = () => {
		const documentIds = [];
		fetchKnowledgeData(documentIds, searchText);
	};

	const downloadFile = (url) => {
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		// a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	const handleDownloadFile = (id) => {
		downloadFile(`/aikb/v1/doc/download?id=${id}`);
	}

	console.log('knowledgeData', knowledgeData);
	const { reference = [] } = (knowledgeData || [])[0] || {};

	return (
		<div className="page-knowledge-search">
			<Space.Compact size="large" style={{ width: '100%' }}>
				<Input placeholder="请输入要检索的内容" value={searchText} onChange={handleSearchTextChange} />
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
					reference.length > 0 && (
						<div className="right">
							<div className="list-area">
								{
									reference.map((referenceItem, index) => (
										<div className='item' key={index}>
											<div className='head'>
												<div className='text1'>{`检索文档片段${index+1}`}</div>
												<div>
													{/* <span className='text1'>文档：</span> */}
													<a onClick={() => { handleDownloadFile(referenceItem.docId) }}>{referenceItem.title}</a>
												</div>
											</div>
											<div className='desc text2'>
												{referenceItem.content}
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
