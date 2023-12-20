/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Space, message, Modal, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Store from './store';

import './style.less';

const KnowledgeQA = () => {
	// useContext 订阅mobx数据
	const pageStore = useContext(Store);
	const [searchText, setSearchText] = useState('');
	const [addChatModalShow, setAddChatModalShow] = useState(false);
	const [addChatModalForm] = Form.useForm();

	const {
		chatList, fetchChatHistoryData, fetchCreateChat, fetchDeleteChat, fetchSearchChatContent, fetchChatList
	} = pageStore;

	const handleInputChange = (e) => {
		setSearchText(e.target.value);
	}

	const getChatList = () => {
		const params = {
			chatId: '',
			page: 0,
			size: '',
			sort: 'createdDate,desc'
		};
		fetchChatList(params);
	}

	useEffect(() => {
		getChatList();
	}, []);

	const getSearchAnswer = () => {
		const params = {
			title: 'hello',
		};

		fetchCreateChat(params);

		// @ts-ignore
		// pageStore.chatList = [...chatList, askInfo];

	}

	const handleCreateChat = () => {
		setAddChatModalShow(true);
	}

	const handleCreateChatOk = async () => {
		const {title} = addChatModalForm.getFieldsValue();
		const params = {
			title,
		};

		await fetchCreateChat(params);
		setAddChatModalShow(false);
		getChatList();
	}

	const handleSelectChat = (selectedItem) => {
		const newChatList = chatList.map((listItem) => {
			const newChatItem = listItem;
			if (selectedItem.id === listItem.id) {
				newChatItem.isActive = true;
			} else {
				newChatItem.isActive = false;
			}
			return newChatItem;
		});
		pageStore.chatList = newChatList;
		pageStore.currentChatId = selectedItem.id;

		const params = {
			chatId: selectedItem.id,
			page: 0,
			size: '',
			sort: 'createdDate,desc'
		};
		fetchChatHistoryData(params);
	}

	const handleDeleteChat = (chatItem) => {
		fetchDeleteChat(chatItem.id);
		message.success('删除成功！');
		getChatList();
	}

	const handleSearchChatContent = () => {
		const params = 1;

		fetchDeleteChat(params);
	}

	return (
		<div className="page-knowledge-qa">
			<div className='chat-list'>
				<div className='create-chat-item' onClick={handleCreateChat}><PlusOutlined />创建会话</div>
				{
					chatList.map((chatItem) => (
						<div
  							className={chatItem.isActive ? 'chat-item chat-item-active' : 'chat-item'}
  							onClick={() => { handleSelectChat(chatItem); }}
						>
							<span>{chatItem.title}</span>
							<DeleteOutlined
								onClick={() => { handleDeleteChat(chatItem) }}
								style={{ fontSize: '10px' }}
							/>
						</div>
					))
				}
			</div>
			<div className='chat-content'>
				<div className='knowledge-content'>
					<div className="content">
						<div className="mesage-box">
							{/* {chatList.map((item, index) =>
								item.type === 'ask' ? (
									<div className="ask-item" key={index}>
										<div className="message-item">问：{item.text}？</div>
									</div>
								) : (
									<div className="answer-item" key={index}>
										<div className="message-item">答：{item.text}</div>
									</div>
								),
							)} */}
						</div>
						{/* <Input size="large" placeholder="请输入问题" onChange={handleInputChange} /> */}
						<Space.Compact size="large" style={{ width: '100%' }}>
							<Input placeholder="请输入要查询的问题" onChange={handleInputChange} />
							<Button type="primary" onClick={getSearchAnswer}>
								发送
							</Button>
						</Space.Compact>
					</div>
				</div>
			</div>
			<Modal
				title="新增会话"
				open={addChatModalShow}
				onCancel={() => { setAddChatModalShow(false); }}
				onOk={handleCreateChatOk}
			>
				<div style={{ paddingTop: '10px' }}>
					<Form
						form={addChatModalForm}
						name="control-ref"
					>
						<Form.Item name="title" label="问题">
							<Input placeholder='请输入会话标题' />
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</div>
	);
};

export default observer(KnowledgeQA);
