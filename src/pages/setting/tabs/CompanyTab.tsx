import React from 'react';
import { TurtleFormInput, TurtleIcon } from '@components/element';
import { Form, Radio } from 'antd';
import { t } from 'i18next';

import Card from '../card/UserCard';

function CompanyTab() {
  return (
    <>
      <Card title="사업자 정보" icon={<TurtleIcon name="company" />}>
        <Form
          onValuesChange={() => {}}
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
    </>
  );
}

export default CompanyTab;
