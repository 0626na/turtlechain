import { t } from 'i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { Form, Button, Input } from 'antd';
import { message } from '@utils/message';
import { PhoneAuthForm } from '@components/combine';
import userAPI from '@apis/userAPI';
import React from 'react';
import { css } from '@emotion/react';
import { TurtleDivider, TurtleText } from '@components/element';

const requiredRules = [
  { required: true, message: t('description.required item') },
];

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  // 아이디 리스트 요청
  const getIDQuery = useQuery(
    ['getID', phone, token],
    () => userAPI.getID({ phone, token }),
    {
      enabled: !!phone && !!token,
      onSuccess: (data) => {
        form.setFieldsValue({ login_id: data[0]?.login_id });
      },
    },
  );

  // 비밀번호 재설정 요청
  const resetPasswordMutation = useMutation(userAPI.resetPassword, {
    onSuccess: () => {
      // form.resetFields();
      // setPhone('');
      // setToken('');
      message.success(t('message.success reset password'));
      navigate('/');
    },
  });

  // 비밀번호 재설정
  const handleReset = () => {
    form //
      .validateFields()
      .then((value) => {
        const { login_id, password } = value;
        resetPasswordMutation.mutate({ login_id, password, phone, token });
      });
  };

  return (
    <>
      <div css={cardCss.self}>
        <TurtleText css={cardCss.title}>{t('reset password')}</TurtleText>
        <TurtleText css={cardCss.subTitle}>
          {!getIDQuery.data
            ? t('description.please phone auth')
            : '새로운 비밀번호를 설정해주세요.'}
        </TurtleText>
      </div>

      <Form form={form} layout="vertical" css={formItemMargin}>
        {!getIDQuery.data && (
          <PhoneAuthForm
            onSuccess={({ token, phone }) => {
              setToken(token);
              setPhone(phone);
            }}
          />
        )}

        {getIDQuery.data && (
          <>
            <Form.Item //
              name="login_id"
              label={t('id')}
            >
              <Input css={input} disabled />
            </Form.Item>
            <Form.Item //
              name="password"
              label={t('new password')}
              rules={requiredRules}
            >
              <Input.Password
                css={input}
                placeholder="문자,숫자 시호를 조합해 8자 이상"
              />
            </Form.Item>

            <Form.Item //
              name="confirmPassword"
              label={t('confirm new password')}
              rules={[
                ...requiredRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(t('message.not match password')),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                css={input}
                placeholder="비밀번호를 다시 한번 입력해주세요."
              />
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => (
                <Button //
                  css={button}
                  disabled={
                    !getFieldValue('password') ||
                    getFieldValue('password') !==
                      getFieldValue('confirmPassword')
                  }
                  loading={resetPasswordMutation.isLoading}
                  onClick={handleReset}
                >
                  {t('reset password')}
                </Button>
              )}
            </Form.Item>
          </>
        )}

        <div css={footerCss.self}>
          <Link to="/" css={footerCss.content}>
            {t('login')}
          </Link>
          <TurtleDivider type="vertical" />
          <Link to="/find-id" css={footerCss.content}>
            {t('auth.findId')}
          </Link>
        </div>
      </Form>
    </>
  );
}
const input = css({
  height: 44,
  borderRadius: 8,
});

const formItemMargin = css({
  '.ant-form-item': {
    marginBottom: 28,
  },
});

const button = css`
  margin: 12px 0 -20px;
  background: #00b3be;
  color: #fff;

  height: 48px;
  width: 100%;
  &:hover {
    color: #fff;
    background: #00b3be;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    background: #00b3be;
  }

  &.ant-btn[disabled] {
    background: #00b3be;
    opacity: 0.5;

    color: #fff;
    border-color: #00b3be;
  }
`;

const footerCss = {
  self: css({
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    marginTop: 60,
  }),

  content: css({
    color: '#6b6d73',
  }),
};

const cardCss = {
  self: css({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 40,
  }),

  title: css({
    fontWeight: 700,
    fontSize: 24,
    color: '#141720',
    marginBottom: 16,
  }),

  subTitle: css({
    fontWeight: 400,
    color: '#5b5d63',
  }),
};

export default ResetPasswordForm;
