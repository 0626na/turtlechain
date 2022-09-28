import React, { useEffect } from 'react';

import { TurtleFormInput, TurtleIcon, TurtleTabs } from '@components/element';

import { PageHeader } from '@layout/page';
import { Form, Radio, Tabs } from 'antd';
import { t } from 'i18next';

import { css } from '@emotion/react';

import Card from './Card';
import UserTab from './tabs/UserTab';
import { useSearchParams } from 'react-router-dom';

function PageBody() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // 초기 진입시 user로 설정.
    if (!searchParams.get('tab')) setSearchParams({ tab: 'user' });
  }, [searchParams, setSearchParams]);

  return (
    <>
      <PageHeader title="설정" />

      <div // pageContent
        css={css`
          flex-grow: 1;
          background-color: #f9f9fa;
        `}
      >
        <TurtleTabs
          color="dark"
          defaultActiveKey="0"
          activeKey={searchParams.get('tab') as string}
          onChange={(newKey) => {
            setSearchParams({ tab: newKey });
          }}
        >
          <Tabs.TabPane key="user" tab="계정관리">
            <div css={tabContent}>
              <UserTab />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="company" tab="사업자 관리">
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
          <Tabs.TabPane key="store" tab="쇼핑몰 관리">
            <div css={tabContent}>ㅁ</div>
          </Tabs.TabPane>
          <Tabs.TabPane key="mistransferRefund" tab="오입금 환불">
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
