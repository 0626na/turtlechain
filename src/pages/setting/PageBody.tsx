import React, { useEffect, useState } from 'react';

import {
  SecondaryButton,
  TurtleFormInput,
  TurtleIcon,
  TurtleSearchInput,
  TurtleTableTitle,
  TurtleTabs,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageHeader, PageTitle } from '@layout/page';
import { Form, Pagination, Radio, Row, Select, Steps, Table, Tabs } from 'antd';
import { t } from 'i18next';
import { useQuery } from 'react-query';

import clearingAPI, {
  ClearingInfo,
  RequestGetOverpaidBalanceList,
} from '@apis/clearingAPI';
// import DetailModal from './modals/DetailModal';
import moment from 'moment';
import { css } from '@emotion/react';
import { FileMarkdownFilled } from '@ant-design/icons';
import Card from './Card';
import UserTab from './tabs/UserTab';
// import AddModal from './modals/AddModal';

function PageBody() {
  const [selectedRow, setSelectedRow] = useState<ClearingInfo>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetOverpaidBalanceList>(
    {
      rt_store_id: undefined,
      balance_type: 'balance',
      search_string: '',
      page: 1,
    },
  );

  const [addModalVisible, addModalOpen, addModalClose] = useModal();
  const [detailModalVisible, detailModalOpen, detailModalClose] = useModal();

  // 장부 리스트 불러오기 요청
  const getOverpaidBalanceListQuery = useQuery(
    ['getOverpaidBalanceList', searchQuery],
    () => clearingAPI.getOverpaidBalanceList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  const loading = getOverpaidBalanceListQuery.isLoading;

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id as number,
    }));
  }, [store.selected?.id]);

  return (
    <>
      {/*
       * 과거매입 모달
       */}
      {/* <AddModal visible={addModalVisible} closeModal={addModalClose} /> */}
      {/*
       * 상세보기 모달
       */}
      {/* <DetailModal
        selectedRow={selectedRow as ClearingInfo}
        visible={detailModalVisible}
        onClose={detailModalClose}
      /> */}

      <PageHeader title="설정" />

      <div // pageContent
        css={css`
          flex-grow: 1;
          background-color: #f9f9fa;
        `}
      >
        <TurtleTabs color="dark" defaultActiveKey="1">
          <Tabs.TabPane key="0" tab="계정관리">
            <div css={tabContent}>
              <UserTab />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="1" tab="사업자 관리">
            <div css={tabContent}>
              <Card title="사업자 정보" icon={<TurtleIcon name="user" />}>
                <Form
                  onValuesChange={(changedValues, allValues) => {
                    console.log(changedValues, allValues); //  수정버튼 활성화.
                  }}
                  colon={false}
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Form.Item label="사업자 종류" name="aaa">
                    <Radio.Group>
                      {['entity', 'personal', 'simple'].map((option) => (
                        <Radio key={option} value={option}>
                          {t(`biz ${option}`)}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="사업자명(법인명)">
                    <TurtleFormInput />
                  </Form.Item>
                  <Form.Item label="이메일">
                    <TurtleFormInput />
                  </Form.Item>
                  <Form.Item label="휴대전화 번호">
                    <TurtleFormInput />
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="쇼핑몰 관리">
            <div css={tabContent}>ㅁ</div>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="오입금 환불">
            <div css={tabContent}>ㅁ</div>
          </Tabs.TabPane>
        </TurtleTabs>
      </div>
    </>
  );
}

const tabContent = css`
  padding: 38px 36px 0px 36px;
`;

export default PageBody;
