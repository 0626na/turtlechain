import { t } from 'i18next';
import { useSearchParams } from 'react-router-dom';
import { Form } from 'antd';
import { PhoneAuthForm } from '@components/combine';
import React from 'react';
import { css } from '@emotion/react';
import { TurtleText } from '@components/element';

interface Props {
  type?: 'find-id' | 'reset-password'; // 아이디 찾기 or 비밀번호 찾기
}

function PhoneAuthCard({ type }: Props) {
  const [_, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  return (
    <>
      <div css={cardCss.self}>
        <TurtleText css={cardCss.title}>
          {type === 'find-id'
            ? t('description.findId')
            : t('button.reset password')}
        </TurtleText>
        <TurtleText css={cardCss.subTitle}>
          {t('description.please phone auth')}
        </TurtleText>
      </div>

      <Form form={form} layout="vertical" css={formItemMargin}>
        <PhoneAuthForm
          type="find"
          onSuccess={({ token, phone }) => {
            setSearchParams({ phone, token });
          }}
        />
      </Form>
    </>
  );
}

const formItemMargin = css({
  '.ant-form-item': {
    marginBottom: 28,
  },
});

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

export default PhoneAuthCard;
