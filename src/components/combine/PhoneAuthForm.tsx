import moment from 'moment';
import { t } from 'i18next';
import { Form, Input, Button, Row } from 'antd';
import { css } from '@emotion/react';
import React from 'react';
import { TurtleIcon } from '@components/element';

import { usePhoneAuth } from '@hooks/index';
interface Props {
  type: 'registration' | 'find'; //  회원가입에서와 아이디,비밀번호찾기에서의 구분
  onSuccess: (data: { phone: string; token: string }) => void; // 인증 성공 콜백
}

function PhoneAuthForm({ onSuccess, type }: Props) {
  const form = Form.useFormInstance();

  const {
    expire_time,
    authStatus,
    verifyOTPcode,
    createPhoneOTPofFind,
    createPhoneOTPofRegistration,
    createOTPloading,
    verifyOTPloading,
  } = usePhoneAuth();

  // 인증코드 생성
  const handleCreate = () => {
    if (authStatus === t('description.success')) return;

    if (type === 'registration') {
      createPhoneOTPofRegistration(form.getFieldValue('phone'));

      return;
    }

    if (type === 'find') {
      createPhoneOTPofFind(form.getFieldValue('phone'));

      return;
    }
  };

  // 인증코드 확인
  const handleVerify = async () => {
    const token = await verifyOTPcode(form.getFieldValue('otp_code'));

    onSuccess({
      phone: form.getFieldValue('phone'),
      token: token ?? 'unknown',
    });
  };

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
                  loading={createOTPloading}
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
                    ['--color' as string]: colorMap[type].color,
                    ['--background-color' as string]:
                      colorMap[type].backgroundColor,
                  }}
                  disabled={!expire_time || !getFieldValue('otp_code')}
                  loading={verifyOTPloading}
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

const colorMap = {
  registration: {
    color: '#6B6D73',
    backgroundColor: '#F0F3F6',
  },
  find: {
    color: '#fff',
    backgroundColor: '#00b3be',
  },
};

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

export default PhoneAuthForm;
