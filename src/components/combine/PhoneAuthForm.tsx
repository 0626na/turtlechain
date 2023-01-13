import moment from 'moment';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { Form, Input, Button, Row } from 'antd';
import { message } from '@utils/message';
import { useMutation, useQueryClient } from 'react-query';
import authAPI from '@apis/authAPI';
import { css } from '@emotion/react';
import React from 'react';
import { TurtleIcon } from '@components/element';

interface Props {
  type?: 'registration'; // 회원가입에서의 버튼 색상이 다르기때문.
  onSuccess?: (data: { phone: string; token: string }) => void; // 인증 성공 콜백
}

type Auth = '인증하기' | '재발송' | '인증완료';

function PhoneAuthModal({ onSuccess, type }: Props) {
  const form = Form.useFormInstance();
  const [session_key, setSessionKey] = useState('');
  const [expire_time, setExpireTime] = useState<null | number>(null);
  const [authStatus, setAuthStatus] = useState<Auth>(t('description.do'));

  // 인증번호 생성 요청
  const createOTPQuery = useMutation(authAPI.createPhoneOTP, {
    onSuccess: ({ session_key, expire_time }) => {
      message.success(t('message.success create auth num'));
      setAuthStatus(t('description.retry'));
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
      setAuthStatus(t('description.success'));
      onSuccess && onSuccess({ token, phone });
      setSessionKey('');
      setExpireTime(null);
      form.setFieldsValue({ ...form.getFieldsValue(), otp_code: '' });
    },
    onError: () => {
      message.warn(t('message.authentication number does not match'));
    },
  });

  // 남은 시간 계산
  const calculateExpireTime = (time: Date) => {
    return moment.duration(moment(time).diff(moment())).asSeconds() * 1000;
  };

  // 인증코드 생성
  const handleCreate = () => {
    if (authStatus === t('description.success')) return;

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
          return;
        }

        setExpireTime(null);
        clearTimeout(countdown);
        message.warn(t('message.expired auth time'));
      }, 1000);

      return () => {
        clearTimeout(countdown);
      };
    }
  }, [expire_time]);

  return (
    <>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Form.Item
            name="phone"
            label={t('table.mobile')}
            rules={[{ required: type && true }]}
          >
            <Input
              css={input}
              placeholder={t('placeholder.ex. mobile')}
              suffix={
                <Button
                  disabled={!getFieldValue('phone')}
                  css={validateText}
                  type="link"
                  onClick={handleCreate}
                  loading={createOTPQuery.isLoading}
                >
                  {authStatus === t('description.success') ? (
                    <div css={authCheckCss.container}>
                      <span css={authCheckCss.text}>인증완료</span>
                      <TurtleIcon name="checkMark" />
                    </div>
                  ) : (
                    authStatus
                  )}
                </Button>
              }
            />
          </Form.Item>
        )}
      </Form.Item>

      {expire_time && (
        <>
          <Form.Item name="otp_code">
            <Input
              placeholder={t('placeholder.input authentication number')}
              css={input}
              suffix={
                <span css={otpText}>
                  {expire_time && moment(expire_time).format('mm:ss')}
                </span>
              }
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <Row justify="end">
                <Button
                  css={button}
                  style={{
                    ['--color' as string]:
                      type === 'registration' ? '#6B6D73' : '#fff',
                    ['--background-color' as string]:
                      type === 'registration' ? '#F0F3F6' : '#00b3be',
                  }}
                  disabled={!expire_time || !getFieldValue('otp_code')}
                  loading={verifyOTPQuery.isLoading}
                  onClick={handleVerify}
                >
                  확인
                </Button>
              </Row>
            )}
          </Form.Item>
        </>
      )}
    </>
  );
}

const input = css({
  height: 44,
  borderRadius: 8,
});

const button = css({
  backgroundColor: 'var(--background-color)',
  color: 'var(--color)',
  width: 58,
  height: 36,

  '&:hover': {
    color: 'var(--color)',
    background: 'var(--background-color)',
  },

  // active 상태
  '&.ant-btn:focus': {
    color: 'var(--color)',
    backgroundColor: 'var(--background-color)',
  },

  '&.ant-btn[disabled]': {
    backgroundColor: 'var(--background-color)',
    opacity: 0.5,

    color: 'var(--color)',
    borderColor: 'var(--background-color)',
  },
});

const validateText = css({
  color: '#1A66F9',
  '&:hover': { color: '#1A66F9' },
});

const otpText = css({ color: '#fa5252' });

const authCheckCss = {
  container: css({
    display: 'flex',
    alignItems: 'center',
  }),
  text: css({
    marginRight: 4,
  }),
};

export default PhoneAuthModal;
