import React, { useCallback, useEffect, useState } from 'react';
import {
  AddButton,
  AnswerButton,
  TurtleFormInput,
  TurtleIcon,
} from '@components/element';
import { Col, Form, Popconfirm, Radio, Row, Upload } from 'antd';
import { t } from 'i18next';

import Card from '../cards/UserCard';
import { useMutation, useQuery } from 'react-query';
import retailerCompanyAPI, { Company } from '@apis/retailerCompanyAPI';
import { message } from '@utils/message';
import { css } from '@emotion/react';
import { bizNumPattern } from '@utils/pattern';
import { DaumPostcodeModal } from '@components/combine';
import { useSearchParams } from 'react-router-dom';
import { RcFile } from 'antd/lib/upload';
import useUser from '@hooks/useUser';

function CompanyTab() {
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const [form] = Form.useForm();
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const showButtons = () => {
    setButtonsVisible(true);
  };

  const hideButtons = () => {
    setButtonsVisible(false);
  };

  const getCompanyQuery = useQuery(
    'getCompany',
    () => retailerCompanyAPI.get({ company_id: Number(user?.company_id) }),
    {
      enabled: !!user,
      onSuccess: (data: Company) => {
        resetStates(data);
      },
    },
  );

  const updateMutation = useMutation(retailerCompanyAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));
      getCompanyQuery.refetch();
      hideButtons();
    },
  });

  const normFile = (
    uploadFiles:
      | { file: RcFile; fileList: RcFile[] }
      | { file: RcFile; fileList: RcFile[] }[],
  ) => {
    if (Array.isArray(uploadFiles)) {
      return uploadFiles;
    }
    return uploadFiles && uploadFiles.fileList;
  };

  const resetStates = useCallback(
    (data: Company) => {
      form.setFieldsValue({
        company_id: data?.id,
        biz_type: data?.biz_type,
        biz_num: data?.biz_num.replace(bizNumPattern, '$1-$2-$3'),
        name: data?.name,
        address_main: data?.address.split('::')[0],
        address_sub: data?.address.split('::')[1],
        email: data?.email,
        memo: data?.memo,
        biz_license_file: [
          {
            uid: '1',
            name: data?.biz_license_path.split('/').pop(),
            status: 'done',
            url: `${data?.biz_license_path}?_=${+new Date()}`,
          },
        ],
      });
    },
    [form],
  );

  useEffect(() => {
    if (searchParams.get('tab') !== 'company' && !!getCompanyQuery.data) {
      hideButtons();
      resetStates(getCompanyQuery.data);
      return;
    }
  }, [getCompanyQuery.data, resetStates, searchParams]);

  return (
    <>
      <DaumPostcodeModal
        visible={postcodeModalVisible}
        onClose={() => setPostcodeModalVisible(false)}
        onGetAddress={(address_main) => {
          form.setFieldsValue({ ...form.getFieldsValue, address_main });
        }}
      />
      <Card title={t('table.biz info')} icon={<TurtleIcon name="company" />}>
        <Form
          form={form}
          onValuesChange={() => {
            showButtons();
          }}
          onFinish={() => {
            form.validateFields().then((value) => {
              updateMutation.mutate({
                company_id: value.company_id,
                biz_type: value.biz_type,
                name: value.name,
                address_main: value.address_main,
                address_sub: value.address_sub ?? '',
                email: value.email ?? '',
                memo: value.memo ?? '',
                biz_license_file: value.biz_license_file[0].originFileObj,
              });
            });
          }}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <Form.Item name="company_id" hidden>
            <TurtleFormInput hidden />
          </Form.Item>

          <Form.Item label={t('table.biz type')} name="biz_type">
            <Radio.Group>
              {['entity', 'personal', 'simple'].map((option) => (
                <Radio key={option} value={option}>
                  {t(`type.biz.${option}`)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={t('table.biz name')}
            required={false}
            rules={[{ required: true }]}
            name="name"
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item label={t('table.biz num')} name="biz_num">
            <TurtleFormInput disabled />
          </Form.Item>

          <Form.Item label={t('table.biz address')} name="address_main">
            <TurtleFormInput onClick={() => setPostcodeModalVisible(true)} />
          </Form.Item>

          <Form.Item label={t('table.biz detail address')} name="address_sub">
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="biz_license_file"
            label={t('table.biz license')}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            required={false}
            rules={[{ required: true }]}
          >
            <Upload
              css={upload}
              maxCount={1}
              accept=".jpg, .png, .jpeg, .pdf"
              beforeUpload={() => false}
            >
              <AddButton>{t('button.attachPicture')}</AddButton>
            </Upload>
          </Form.Item>

          <Form.Item label={t('table.vat issued mail')} name="email">
            <TurtleFormInput />
          </Form.Item>

          <Form.Item label={t('table.memo')} name="memo">
            <TurtleFormInput />
          </Form.Item>

          {buttonsVisible && (
            <Row
              css={css`
                margin-top: 32px;
              `}
              justify="end"
              align="middle"
            >
              <Col>
                <AnswerButton
                  type="NO"
                  text="취소"
                  onClick={() => {
                    if (!getCompanyQuery.data) return;
                    // 취소를 누르면 최초 값으로 초기화.
                    resetStates(getCompanyQuery.data);
                    hideButtons();
                  }}
                />
              </Col>

              <Col css={marginleft}>
                <AnswerButton
                  type="YES"
                  text={t('button.save')}
                  htmlType="submit"
                  loading={updateMutation.isLoading}
                />
              </Col>
            </Row>
          )}
        </Form>
      </Card>
    </>
  );
}

const upload = css`
  display: flex;

  .ant-upload-list {
    margin-left: 12px;
  }

  .ant-upload-list-item-name {
    color: #a1a2a6;
    width: 200px;
  }
`;

const marginleft = css`
  margin-left: 8px;
`;

export default CompanyTab;
