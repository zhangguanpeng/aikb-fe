import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { createContext } from 'react';
import dayjs from 'dayjs';

import request from '@/services/newRequest';

class CompanySetStore {
    @observable tableData = [
        {
            name: '阿里巴巴',
            id: 'alibaba',
            createDate: '2019-11-11 11:11',
            status: true,
        },
        {
            name: '蚂蚁金服',
            id: 'ant',
            createDate: '2019-12-12 12:12',
            status: false,
        },
    ];

    @observable knowledgeData = [];

    @observable loading = false;

    @observable statusLoading = false;

    @observable newModalVisible = false;

    @observable newLoading = false;

    @observable modalType = 'new';

    @observable modalData = {};

    @observable pagination = {
        size: 'small',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        showSizeChanger: true,
        onChange: (currentP, size) => {
            this.qryTableDate(currentP, size);
        },
        onShowSizeChange: (currentP, size) => {
            this.qryTableDate(currentP, size);
        },
        showTotal: (totalP) => `共 ${totalP} 条记录`,
    };

    @observable searchParams = {
        name: undefined,
        gmtBegin: dayjs(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
        gmtEnd: dayjs(new Date()).format('YYYY-MM-DD'),
    };

    @computed get modalTitle() {
        let res = '项目';
        if (this.modalType === 'edit') {
            res = `编辑${res}`;
        } else if (this.modalType === 'new') {
            res = `新增${res}`;
        }
        return res;
    }

    // 列表数据
    @action.bound
    async fetchKnowledgeData(documentIds, text) {
        try {
            this.loading = true;
            this.knowledgeData = [];
            const res = await request({
                url: '/aikb/v1/search',
                method: 'post',
                data: { documentIds, text },
                headers: {
					'Content-Type': 'application/json',
				},
            });

            console.log('知识检索res', res);

            if (!res.payload) {
                return;
            }
            // if (res.success) {
            // const resData = res.payload || {};
            // this.knowledgeData = resData;
            // this.pagination.total = resData.total;
            // this.pagination.currentPage = page;
            // this.pagination.pageSize = size;
            // }
            const resData = res.payload || {};
            this.knowledgeData = resData;
            this.loading = false;
        } catch (error) {
            console.log('获取知识接口错误', error);
        }

    }

    // 删除
    @action.bound
    async delOne(data) {
        this.recordLoding = true;
        const res = await request({
            url: '/user/delete',
            method: 'post',
            data: { no: data },
        });
        if (res.success) {
            message.success('删除成功！');
            this.qryTableDate();
        }
        this.recordLoding = false;
    }
}

export default createContext(new CompanySetStore());
