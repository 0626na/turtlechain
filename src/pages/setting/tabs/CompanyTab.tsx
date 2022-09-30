import React, { useState } from 'react';
import { TurtleFormInput, TurtleIcon } from '@components/element';
import { Form, message, Radio } from 'antd';
import { t } from 'i18next';

import Card from '../card/UserCard';
import { useMutation, useQuery } from 'react-query';
import retailerCompanyAPI from '@apis/retailerCompanyAPI';
import { AxiosError } from 'axios';

function CompanyTab() {
  const [form] = Form.useForm();
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const getQuery = useQuery('getCompany', retailerCompanyAPI.get, {
    onSuccess: (data) => {
      form.setFieldsValue({
        biz_license_file: `${data?.biz_license_path}?_=${+new Date()}`,
      });
    },
  });

  const updateQuery = useMutation('updateCompany', retailerCompanyAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));

      getQuery.refetch();
    },
  });

  //세금계산서 유효성검사
  const checkEmailValidityQuery = useMutation(
    'checkEmailValidityQuery',
    retailerCompanyAPI.checkEmailValidity,
    {
      onSuccess: (data) => {
        message.success(data.msg);

        form.setFieldsValue({
          ...form.getFieldsValue(),
          email: [
            ...form.getFieldValue('email'),
            form.getFieldValue('newEmail'),
          ],
        });
        form.resetFields(['newEmail']);
      },
      onError: (data: AxiosError) => {
        message.error(data.response?.data.msg);
      },
    },
  );

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
          <Form.Item label="사업자번호">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="사업장주소">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="사업장 상세주소">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="사업자등록증">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="쇼핑몰URL">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="세금계산서 발행메일">
            <TurtleFormInput />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default CompanyTab;
