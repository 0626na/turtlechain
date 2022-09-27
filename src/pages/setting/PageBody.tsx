import React from 'react';

import { TurtleFormInput, TurtleIcon, TurtleTabs } from '@components/element';

import { PageHeader } from '@layout/page';
import { Form, Radio, Tabs } from 'antd';
import { t } from 'i18next';

import { css } from '@emotion/react';

import Card from './Card';
import UserTab from './tabs/UserTab';

function PageBody() {
  return (
    <>
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
