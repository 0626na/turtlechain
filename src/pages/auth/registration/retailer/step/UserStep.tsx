import userAPI from '@apis/userAPI';
import { PhoneAuthForm } from '@components/combine';
import { SpecialButton } from '@components/element';
import { css } from '@emotion/react';
import { emailPattern } from '@utils/pattern';
import { Button, Form, Input, message, Row } from 'antd';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  onClickNext: () => void;
}

function UserStep({ visible, onClickNext }: Props) {
  const form = Form.useFormInstance();
  const [checkDuplicated, setCheckDuplicated] = useState(false);

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
  const idValidation = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('아이디를 입력해주세요.'));
    }

    if (!checkDuplicated && value) {
      return Promise.reject(new Error('아이디 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  //이메일 유효성 검사
  const emailValidation = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('이메일을 입력해주세요.'));
    }

    if (!emailPattern.test(value)) {
      return Promise.reject(new Error('유효하지 않은 이메일 입니다.'));
    }

    return Promise.resolve();
  };

  // 비밀번호 확인 유효성 검사
  const passwordValidation = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호 입력해주세요.'));
    }

    if (value && value !== form.getFieldValue('user_password')) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }

    return Promise.resolve();
  };

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Form.Item
        rules={[{ required: true }]}
        name="user_name"
        label={t('user name')}
      >
        <Input css={input} placeholder="ex. 김거북" />
      </Form.Item>

      <Form.Item
        required
        rules={[{ validator: emailValidation }]}
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
            rules={[{ validator: idValidation }]}
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
                  css={{ color: '#1A66F9', '&:hover': { color: '#1A66F9' } }}
                  type="link"
                  disabled={!getFieldValue('user_login_id') || checkDuplicated}
                  onClick={() => {
                    dupCheckMutation.mutate({
                      login_id: form.getFieldValue('user_login_id'),
                    });
                  }}
                >
                  {t('button.duplicatedCheck')}
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
        rules={[{ validator: passwordValidation }]}
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

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Row css={marginTop}>
            <SpecialButton
              size="middle"
              htmlType="button"
              disabled={
                !getFieldValue('user_name') ||
                !getFieldValue('user_email') ||
                !getFieldValue('user_mobile') ||
                !getFieldValue('user_login_id') ||
                !getFieldValue('user_password') ||
                !getFieldValue('confirm_password') ||
                !checkDuplicated
              }
              onClick={() => {
                onClickNext();
              }}
            >
              {t('next')}
            </SpecialButton>
          </Row>
        )}
      </Form.Item>
    </div>
  );
}

const marginTop = css({ marginTop: 40 });

const input = css`
  height: 44px;
  border-radius: 8px;
`;

export default UserStep;
