import { Form, message } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import React from 'react';

import userAPI from '@apis/userAPI';

import CompanyStep from './step/CompanyStep';
import ResultStep from './step/ResultStep';
import UserStep from './step/UserStep';

import { css } from '@emotion/react';

function Pagebody() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const createUserQuery = useMutation('createUser', userAPI.create, {
    onSuccess: () => {
      setCurrentStep(2);
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  return (
    <>
      <div css={{ display: currentStep === 2 ? 'none' : '' }}>
        <div
          css={css`
            position: relative;
            height: 100px;
            display: flex;
            justify-content: center;
          `}
        >
          <img
            css={css`
              position: absolute;
              height: 100px;
            `}
            src={`${process.env.PUBLIC_URL}/assets/img/background_signup.png`}
            alt="signup_logo"
          />
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <span
              css={css`
                font-weight: 700;
                color: #141720;
                font-size: 20px;
                text-align: center;
              `}
            >
              쉽고 똑똑한 <br />
              쇼핑몰 업무의 시작
            </span>
            <span
              css={css`
                font-weight: 400;
                font-size: 14px;
                color: #5b5d63;
              `}
            >
              지금, 터틀체인과 함께해요
            </span>
          </div>
        </div>

        {/*
         * 탭
         */}

        <div css={container}>
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
            {currentStep === 0 ? '사업자 정보 빕력' : '계정 정보 입력'}
          </div>

          <div css={content}>
            <Form
              layout="vertical"
              form={form}
              onFinish={(value) => {
                createUserQuery.mutate({
                  ...value,
                  user_type: 'rt',
                  company_biz_license_file:
                    value.company_biz_license_file[0].originFileObj,
                });
              }}
            >
              <CompanyStep
                form={form}
                visible={currentStep === 0}
                onClickNext={() => {
                  setCurrentStep((currentStep) => currentStep + 1);
                }}
              />

              <UserStep
                form={form}
                visible={currentStep === 1}
                onClickPrev={() => {
                  setCurrentStep((currentStep) => currentStep - 1);
                }}
                loading={createUserQuery.isLoading}
              />
            </Form>
          </div>
        </div>
      </div>

      <ResultStep visible={currentStep === 2} />
    </>
  );
}
const container = css({ width: 472, margin: '20px auto 0px' });

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

export default Pagebody;
