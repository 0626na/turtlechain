import React, { useCallback, useEffect, useState } from 'react';
import {
  AddButton,
  AnswerButton,
  TurtleFormInput,
  TurtleIcon,
} from '@components/element';
import { Col, Form, message, Popconfirm, Radio, Row, Upload } from 'antd';
import { t } from 'i18next';

import Card from '../cards/UserCard';
import { useMutation, useQuery } from 'react-query';
import retailerCompanyAPI, { Company } from '@apis/retailerCompanyAPI';

import { css } from '@emotion/react';
import { bizNumPattern } from '@utils/pattern';
import { DaumPostcodeModal } from '@components/combine';
import { useSearchParams } from 'react-router-dom';
import { RcFile } from 'antd/lib/upload';

function CompanyTab() {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const showButtons = () => {
    setButtonsVisible(true);
  };

  const hideButtons = () => {
    setButtonsVisible(false);
  };

  const getCompanyQuery = useQuery('getCompany', retailerCompanyAPI.get, {
    onSuccess: (data) => {
      resetStates(data);
    },
  });

  const updateMutation = useMutation(retailerCompanyAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));
      getCompanyQuery.refetch();
      hideButtons();
    },
  });

  //세금계산서 유효성검사
  // const checkEmailValidityQuery = useMutation(
  //   retailerCompanyAPI.checkEmailValidity,
  //   {
  //     onSuccess: (data) => {
  //       message.success(data.msg);

  //       form.setFieldsValue({
  //         ...form.getFieldsValue(),
  //         email: [
  //           ...form.getFieldValue('email'),
  //           form.getFieldValue('newEmail'),
  //         ],
  //       });
  //       form.resetFields(['newEmail']);
  //     },
  //     onError: (data: AxiosError) => {
  //       message.error(data.response?.data.msg);
  //     },
  //   },
  // );

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
    resetStates(getCompanyQuery.data as Company);
  }, [getCompanyQuery.data, resetStates]);

  useEffect(() => {
    if (searchParams.get('tab') !== 'company') {
      hideButtons();
      resetStates(getCompanyQuery.data as Company);
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
      <Card title="사업자 정보" icon={<TurtleIcon name="company" />}>
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

          <Form.Item label="사업자 종류" name="biz_type">
            <Radio.Group>
              {['entity', 'personal', 'simple'].map((option) => (
                <Radio key={option} value={option}>
                  {t(`biz ${option}`)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="사업자명(법인명)"
            required={false}
            rules={[{ required: true }]}
            name="name"
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item label="사업자번호" name="biz_num">
            <TurtleFormInput disabled />
          </Form.Item>

          <Form.Item label="사업장주소" name="address_main">
            <TurtleFormInput onClick={() => setPostcodeModalVisible(true)} />
          </Form.Item>

          <Form.Item label="사업장 상세주소" name="address_sub">
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="biz_license_file"
            label="사업자등록증"
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
              <AddButton>사진 첨부하기</AddButton>
            </Upload>
          </Form.Item>

          <Form.Item label="세금계산서 발행메일" name="email">
            <TurtleFormInput />
          </Form.Item>

          <Form.Item label="메모" name="memo">
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
                  text="취소 "
                  onClick={() => {
                    // 취소를 누르면 최초 값으로 초기화.
                    resetStates(getCompanyQuery.data as Company);
                    hideButtons();
                  }}
                />
              </Col>

              <Col css={marginleft}>
                <AnswerButton
                  type="YES"
                  text="저장"
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
