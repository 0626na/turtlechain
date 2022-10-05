import moment from 'moment';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from 'react-query';
import authAPI from '@apis/authAPI';
import { css } from '@emotion/react';
import React from 'react';

interface Props {
  type?: 'signup';
  onSuccess?: (data: { phone: string; token: string }) => void; // 인증 성공 콜백
}

function PhoneAuthModal({ onSuccess, type }: Props) {
  const [form] = Form.useForm();
  const [session_key, setSessionKey] = useState('');
  const [expire_time, setExpireTime] = useState<null | number>(null);

  // 인증번호 생성 요청
  const createOTPQuery = useMutation(authAPI.createPhoneOTP, {
    onSuccess: ({ session_key, expire_time }) => {
      message.success(t('message.success create auth num'));

      setSessionKey(session_key);
      setExpireTime(calculateExpireTime(expire_time));
    },
  });

  // 인증번호 확인 요청
  const verifyOTPQuery = useMutation(authAPI.verifyPhoneOTP, {
    onSuccess: (data) => {
      message.success(t('message.success verify auth num'));
      const token = data;
      const phone = form.getFieldValue('phone');

      onSuccess && onSuccess({ token, phone });
    },
    onError: () => {
      message.warn('인증번호가 일치하지 않습니다.');
    },
  });

  // 남은 시간 계산
  const calculateExpireTime = (time: Date) => {
    return moment.duration(moment(time).diff(moment())).asSeconds() * 1000;
  };

  // 인증코드 생성
  const handleCreate = () => {
    const { phone } = form.getFieldsValue();
    createOTPQuery.mutate({ phone });
  };

  // 인증코드 확인
  const handleVerify = () => {
    const { otp_code } = form.getFieldsValue();
    verifyOTPQuery.mutate({ session_key, otp_code });
  };

  // 인증 남은 시간 카운트다운
  useEffect(() => {
    if (expire_time !== null) {
      const countdown = setTimeout(() => {
        if (expire_time > 0) {
          setExpireTime(expire_time - 1000);
        } else {
          setExpireTime(null);
          clearTimeout(countdown);
          message.success(t('message.expired auth time'));
        }
      }, 1000);

      return () => {
        clearTimeout(countdown);
      };
    }
  }, [expire_time]);

  return (
    <Form
      form={form}
      layout="vertical"
      css={css`
        .ant-form-item {
          margin-bottom: 16px;
        }
      `}
    >
      <Form.Item name="phone" label={t('phone')}>
        <Input
          css={input}
          placeholder="ex. 010-1234-5678"
          suffix={
            <Button
              css={{
                color: '#1A66F9',
                '&:hover': { color: '#1A66F9' },
              }}
              type="link"
              onClick={handleCreate}
              loading={createOTPQuery.isLoading}
            >
              {createOTPQuery.status === 'success' ? '재발송' : t('auth phone')}
            </Button>
          }
        />
      </Form.Item>

      {expire_time && (
        <>
          <Form.Item name="otp_code">
            <Input
              placeholder="인증번호 입력"
              css={input}
              suffix={
                <span
                  css={css`
                    color: #fa5252;
                  `}
                >
                  {expire_time && moment(expire_time).format('mm:ss')}
                </span>
              }
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <div
                css={css`
                  display: flex;
                  justify-content: end;
                  /* margin */
                `}
              >
                <Button
                  css={button}
                  style={{
                    ['--color' as any]: type === 'signup' ? '#6B6D73' : '#fff',
                    ['--background-color' as any]:
                      type === 'signup' ? '#F0F3F6' : '#00b3be',
                  }}
                  disabled={!expire_time || !getFieldValue('otp_code')}
                  loading={verifyOTPQuery.isLoading}
                  onClick={handleVerify}
                >
                  {!verifyOTPQuery.isLoading && '확인'}
                </Button>
              </div>
            )}
          </Form.Item>
        </>
      )}
    </Form>
  );
}

const input = css`
  height: 44px;
  border-radius: 8px;
`;

const button = css`
  background: var(--background-color);
  color: var(--color);
  width: 58px;
  height: 36px;

  &:hover {
    color: var(--color);
    background: var(--background-color);
  }

  // active 상태
  &.ant-btn:focus {
    color: var(--color);
    background: var(--background-color);
  }

  &.ant-btn[disabled] {
    background: var(--background-color);
    opacity: 0.5;

    color: var(--color);
    border-color: var(--background-color);
  }
`;
export default PhoneAuthModal;
