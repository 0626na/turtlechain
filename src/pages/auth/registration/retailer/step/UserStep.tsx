import userAPI from '@apis/userAPI';
import { PhoneAuthForm } from '@components/combine';
import { CheckDuplicatedButton, SpecialButton } from '@components/element';
import { css } from '@emotion/react';
import { emailPattern } from '@utils/pattern';
import { Form, Input, Row } from 'antd';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { message } from '@utils/message';
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
  const idValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('message.enterId')));
    }

    if (!checkDuplicated && value) {
      return Promise.reject(new Error(t('message.check id dup')));
    }

    return Promise.resolve();
  };

  //이메일 유효성 검사
  const emailValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('message.please input your email')));
    }

    if (!emailPattern.test(value)) {
      return Promise.reject(new Error(t('message.this email is not valid')));
    }

    return Promise.resolve();
  };

  // 비밀번호 확인 유효성 검사
  const passwordValidator = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error(t('message.enterPassword')));
    }

    if (value && value !== form.getFieldValue('user_password')) {
      return Promise.reject(new Error(t('message.not match password')));
    }

    return Promise.resolve();
  };

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Form.Item
        rules={[{ required: true }]}
        name="user_name"
        label={t('table.user name')}
      >
        <Input css={input} placeholder={t('placeholder.ex. id')} />
      </Form.Item>

      <Form.Item
        required
        rules={[{ validator: emailValidator }]}
        name="user_email"
        label={t('table.email')}
      >
        <Input css={input} placeholder={t('placeholder.ex. email')} />
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
            label={t('table.id')}
            name="user_login_id"
          >
            <Input
              css={input}
              onChange={() => {
                setCheckDuplicated(false);
              }}
              placeholder={t('placeholder.input id')}
              suffix={
                <CheckDuplicatedButton
                  onClick={() => {
                    dupCheckMutation.mutate({
                      login_id: form.getFieldValue('user_login_id'),
                    });
                  }}
                  isDuplicated={checkDuplicated}
                  isEmpty={!getFieldValue('user_login_id')}
                >
                  {t('button.duplicatedCheck')}
                </CheckDuplicatedButton>
              }
            />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        rules={[{ required: true }]}
        name="user_password"
        label={t('table.password')}
      >
        <Input.Password
          css={input}
          placeholder={t('placeholder.combination of passwords')}
        />
      </Form.Item>

      <Form.Item
        rules={[{ validator: passwordValidator }]}
        required
        name="confirm_password"
        label={t('table.confirm password')}
        dependencies={['user_password']}
      >
        <Input.Password
          css={input}
          placeholder={t('placeholder.input password again')}
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
              {t('button.next')}
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
