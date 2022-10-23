import { Form, message } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import React from 'react';

import userAPI from '@apis/userAPI';

import CompanyStep from './step/CompanyStep';
import UserStep from './step/UserStep';

import { css } from '@emotion/react';

import Completed from '../Completed';

function Pagebody() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // 가입 신청
  const registrationMutation = useMutation(userAPI.createRegistration, {
    onSuccess: () => {
      setCurrentStep((currentStep) => currentStep + 1);
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  return (
    <>
      {currentStep !== 2 && (
        <div css={container}>
          {/*
           * 탭
           */}
          <div css={tabContainer}>
            <div
              css={tab}
              style={{
                ['--background-color' as any]: '#5b5d63',
              }}
            />
            <div
              css={tab}
              style={{
                ['--background-color' as any]:
                  currentStep === 1 ? '#5b5d63' : '#DEE4EB',
              }}
            />
          </div>

          <div css={header}>
            {currentStep === 0 ? '계정 정보 입력' : '사업자 정보 입력'}
          </div>

          <div css={content}>
            <Form
              css={formItemMargin}
              layout="vertical"
              form={form}
              onFinish={(value) => {
                registrationMutation.mutate({
                  // 계정정보
                  user_type: 'rt',
                  user_name: value.user_name,
                  user_email: value.user_email,
                  user_mobile: value.user_mobile,
                  user_login_id: value.user_login_id,
                  user_password: value.user_password,
                  // 사업자정보
                  company_biz_type: value.company_biz_type,
                  company_owner: '없음', // 추후 사라질 필드.
                  company_name: value.company_name,
                  company_biz_num: value.company_biz_num,
                  company_main_address: value.company_main_address,
                  company_sub_address: value.company_sub_address ?? '',
                  company_store_url: value.company_store_url,
                  company_biz_license_file:
                    value.company_biz_license_file[0].originFileObj,
                  agreements: {
                    service_use: value.agreements.includes('service_use'),
                    personal_information: value.agreements.includes(
                      'personal_information',
                    ),
                    event_notificaton:
                      value.agreements.includes('event_notificaton'),
                    third_party: value.agreements.includes('third_party'),
                  },
                });
              }}
            >
              <UserStep
                visible={currentStep === 0}
                onClickNext={() => {
                  setCurrentStep((currentStep) => currentStep + 1);
                }}
              />

              <CompanyStep
                visible={currentStep === 1}
                loading={registrationMutation.isLoading}
              />
            </Form>
          </div>
        </div>
      )}

      <Completed visible={currentStep === 2} />
    </>
  );
}
const container = css({
  width: 472,
  margin: '20px auto 0px',
});

const header = css({
  textAlign: 'center',
  padding: '12px 0px',
  color: '#fff',
  width: 472,
  background: '#242934',
  borderRadius: '20px 20px 0px 0px',
});

const content = css({
  width: 472,
  padding: '48px 60px',

  background: '#ffffff',
  boxShadow: '0px 10px 30px rgba(41, 77, 119, 0.12)',
  borderRadius: '0px 0px 20px 20px',
});

const tabContainer = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  marginBottom: 15,
});

const tab = css({
  width: 60,
  height: 8,
  borderRadius: 10,
  backgroundColor: 'var(--background-color)',
});

const formItemMargin = css({
  '.ant-form-item': {
    marginBottom: 28,
  },
});

export default Pagebody;
