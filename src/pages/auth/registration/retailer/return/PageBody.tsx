import { Form, message } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import React from 'react';

import userAPI from '@apis/userAPI';

import CompanyStep from './step/CompanyStep';

import UserStep from './step/UserStep';

import { css } from '@emotion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { phonePattern } from '@utils/pattern';
import Completed from '../../Completed';

function Pagebody() {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // 가입정보 불러오기
  const registrationQuery = useQuery(
    ['registrationQuery'],
    () =>
      userAPI.getRegistration({
        encrypted_text: searchParams.get('encrypted_text')!,
      }),
    {
      onSuccess: (data) => {
        form.setFieldsValue({
          // 계정 정보
          user_type: data.data.registration_list[0].user_type,
          user_name: data.data.registration_list[0].user_name,
          user_email: data.data.registration_list[0].user_email,
          user_mobile: data.data.registration_list[0].user_mobile,
          phone: data.data.registration_list[0].user_mobile.replace(
            phonePattern,
            '$1-$2-$3',
          ),
          user_login_id: data.data.registration_list[0].user_login_id,

          // 사업자 정보
          company_biz_type: data.data.registration_list[0].company_biz_type,
          company_owner: '없음', // 추후 사라질 필드
          company_name: data.data.registration_list[0].company_name,
          company_biz_num: data.data.registration_list[0].company_biz_num,
          company_main_address:
            data.data.registration_list[0].company_main_address,
          company_sub_address:
            data.data.registration_list[0].company_sub_address,
          company_biz_license_file: [
            {
              uid: '1',
              name: data.data.registration_list[0].company_biz_license_path
                .split('/')
                .pop(),
              status: 'done',
              url: data.data.registration_list[0].company_biz_license_path,
            },
          ],
          company_store_url: data.data.registration_list[0].company_store_url,
          agreements: data.data.registration_list[0].agreements,
        });
      },
      onError: (error: AxiosError) => {
        if (error.response?.data.msg) {
          message.warn(error.response?.data.msg);
          return;
        }

        // 404
        navigate('/not-found');
      },
    },
  );

  // 재가입 신청
  const updateRegistrationMutation = useMutation(userAPI.updateRegistration, {
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
            {currentStep === 0 ? '사업자 정보 빕력' : '계정 정보 입력'}
          </div>

          <div css={content}>
            <Form
              css={formItemMargin}
              layout="vertical"
              form={form}
              onFinish={(value) => {
                updateRegistrationMutation.mutate({
                  id: registrationQuery?.data?.data.registration_list[0]
                    .id as number,
                  data: {
                    encrypted_text: searchParams.get(
                      'encrypted_text',
                    ) as string,
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
                    agreements: value.agreements,
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
                loading={updateRegistrationMutation.isLoading}
              />
            </Form>
          </div>
        </div>
      )}

      <Completed visible={currentStep === 2} />
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

const formItemMargin = css({
  '.ant-form-item': {
    marginBottom: 28,
  },
});

export default Pagebody;
