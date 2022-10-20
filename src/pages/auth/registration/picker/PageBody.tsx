import { Button, Form, Input, message, Row } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useMutation } from 'react-query';
import React from 'react';

import userAPI from '@apis/userAPI';

import { css } from '@emotion/react';
import { emailPattern } from '@utils/pattern';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { t } from 'i18next';
import { PhoneAuthForm } from '@components/combine';
import AgreementCheckbox from '../AgreementCheckbox';
import { SpecialButton } from '@components/element';
import Completed from '../Completed';

function Pagebody() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkDuplicated, setCheckDuplicated] = useState(false);

  // 가입 신청
  const registrationMutation = useMutation(userAPI.createRegistration, {
    onSuccess: () => {
      setCurrentStep((currentStep) => currentStep + 1);
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  // 아이디 중복체크 요청
  const dupCheckMutation = useMutation(userAPI.dupCheck, {
    onSuccess: (data) => {
      message.success(data.msg);
      setCheckDuplicated(true);
      form.setFields([
        {
          name: 'user_login_id',
          errors: [],
        },
      ]);
    },
    onError: (data: AxiosError) => {
      message.warn(data.response?.data.msg);
      setCheckDuplicated(false);
    },
  });

  // 아이디 유효성 검사
  const idValidator = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('아이디를 입력해주세요.'));
    }

    if (!checkDuplicated && value) {
      return Promise.reject(new Error('아이디 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  //이메일 유효성 검사
  const emailValidator = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('이메일을 입력해주세요.'));
    }

    if (!emailPattern.test(value)) {
      return Promise.reject(new Error('유효하지 않은 이메일 입니다.'));
    }

    return Promise.resolve();
  };

  // 비밀번호 확인 유효성 검사
  const passwordValidator = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호 입력해주세요.'));
    }

    if (value && value !== form.getFieldValue('user_password')) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }

    return Promise.resolve();
  };

  //약관동의 유효성 검사
  const agreementValidator = (_: any, value: CheckboxValueType[] = []) => {
    if (
      !value.includes('service_use') ||
      !value.includes('personal_information')
    ) {
      return Promise.reject(new Error('필수항목을 체크해주세요.'));
    }

    return Promise.resolve();
  };

  return (
    <>
      {currentStep === 0 && (
        <div css={container}>
          <div css={header}>계정 정보 입력</div>

          <div css={content}>
            <Form
              css={formItemMargin}
              layout="vertical"
              form={form}
              onFinish={(value) => {
                registrationMutation.mutate({
                  user_type: 'pi',
                  user_name: value.user_name,
                  user_email: value.user_email,
                  user_mobile: value.user_mobile,
                  user_login_id: value.user_login_id,
                  user_password: value.user_password,
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
              <Form.Item
                rules={[{ required: true }]}
                name="user_name"
                label={t('user name')}
              >
                <Input css={input} placeholder="ex. 김거북" />
              </Form.Item>

              <Form.Item
                required
                rules={[{ validator: emailValidator }]}
                name="user_email"
                label={t('email')}
              >
                <Input css={input} placeholder="ex. gbkim@gmail.com" />
              </Form.Item>

              {/* 유효성 검사를 위해 user_mobile 폼아이템 태그를 만들어줌. */}
              <Form.Item name="user_mobile" hidden>
                <Input />
              </Form.Item>

              <PhoneAuthForm
                type="registration"
                onSuccess={(data) => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    user_mobile: data.phone,
                  });
                }}
              />

              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => (
                  <Form.Item
                    rules={[{ validator: idValidator }]}
                    required
                    label={t('id')}
                    name="user_login_id"
                  >
                    <Input
                      css={input}
                      onChange={() => {
                        setCheckDuplicated(false);
                      }}
                      placeholder="아이디를 입력해주세요"
                      suffix={
                        <Button
                          css={{
                            color: '#1A66F9',
                            '&:hover': { color: '#1A66F9' },
                          }}
                          type="link"
                          disabled={
                            !getFieldValue('user_login_id') || checkDuplicated
                          }
                          onClick={() => {
                            dupCheckMutation.mutate({
                              login_id: form.getFieldValue('user_login_id'),
                            });
                          }}
                        >
                          중복확인
                        </Button>
                      }
                    />
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                rules={[{ required: true }]}
                name="user_password"
                label={t('password')}
              >
                <Input.Password
                  css={input}
                  placeholder="문자, 숫자, 기호를 조합해 8자 이상"
                />
              </Form.Item>

              <Form.Item
                rules={[{ validator: passwordValidator }]}
                required
                name="confirm_password"
                label={t('confirm password')}
                dependencies={['user_password']}
              >
                <Input.Password
                  css={input}
                  placeholder="비밀번호를 다시 한번 입력해주세요"
                />
              </Form.Item>

              <Form.Item
                name="agreements"
                rules={[{ validator: agreementValidator }]}
              >
                <AgreementCheckbox
                  onChange={(data: CheckboxValueType[]) => {
                    form.setFieldsValue({
                      ...form.getFieldsValue(),
                      agreements: data,
                    });
                  }}
                />
              </Form.Item>

              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Row css={marginTop}>
                    <SpecialButton
                      size="middle"
                      htmlType="submit"
                      disabled={
                        !getFieldValue('user_name') ||
                        !getFieldValue('user_email') ||
                        !getFieldValue('user_mobile') ||
                        !getFieldValue('user_login_id') ||
                        !getFieldValue('user_password') ||
                        !getFieldValue('confirm_password') ||
                        !(
                          getFieldValue('agreements')?.includes(
                            'service_use',
                          ) &&
                          getFieldValue('agreements')?.includes(
                            'personal_information',
                          )
                        ) ||
                        !checkDuplicated
                      }
                      loading={registrationMutation.isLoading}
                    >
                      {t('signUp')}
                    </SpecialButton>
                  </Row>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      <Completed visible={currentStep === 1} />
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

const formItemMargin = css({
  '.ant-form-item': {
    marginBottom: 28,
  },
});

const marginTop = css({ marginTop: 40 });

const input = css`
  height: 44px;
  border-radius: 8px;
`;

export default Pagebody;
