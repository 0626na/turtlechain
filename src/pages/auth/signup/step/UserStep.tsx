import userAPI from '@apis/userAPI';
import { PhoneAuthForm } from '@components/combine';
import { SpecialButton } from '@components/element';
import { css } from '@emotion/react';
import { Button, Form, FormInstance, Input, message, Row } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';
import Agree from './Agree';

interface Props {
  visible: boolean;
  loading: boolean;
  form: FormInstance;
}

function UserStep({ visible, loading, form }: Props) {
  const [checkDuplicated, setCheckDuplicated] = useState(false);

  // 아이디 중복체크 요청
  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
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
  const idValidation = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('아이디를 입력해주세요.'));
    }

    if (!checkDuplicated && form.getFieldValue('user_login_id')) {
      return Promise.reject(new Error('아이디 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  // 비밀번호 확인 유효성 검사
  const passwordValidation = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호 입력해주세요.'));
    }

    if (value && value !== form.getFieldValue('user_password')) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }

    return Promise.resolve();
  };

  return (
    <div css={{ display: visible ? '' : 'none' }}>
      <Form.Item
        rules={[{ required: true }]}
        name="user_name"
        label={t('user name')}
      >
        <Input css={input} placeholder="ex. 김거북" />
      </Form.Item>

      <Form.Item
        rules={[{ required: true }]}
        name="user_email"
        label={t('email')}
      >
        <Input css={input} placeholder="ex. gbkim@gmail.com" />
      </Form.Item>

      <PhoneAuthForm
        type="signup"
        onSuccess={(data) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            user_mobile: data.phone,
          });
        }}
      />

      <Form.Item shouldUpdate noStyle>
        {({ getFieldError, getFieldValue }) => (
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
                  disabled={
                    !getFieldValue('user_login_id') ||
                    getFieldError('user_login_id').includes(
                      '아아디를 입력해 주세요.',
                    ) ||
                    checkDuplicated
                  }
                  onClick={() => {
                    dupCheckQuery.mutate({
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

      <Agree
        plainOptions={['Apple', 'Pear', 'Orange']}
        onChange={(list: CheckboxValueType[]) => {
          console.log(list);
        }}
      />

      <Row css={{ marginTop: 40 }}>
        <SpecialButton
          size="middle"
          htmlType="submit"
          onClick={async () => {
            try {
              await form.validateFields([
                'user_name',
                'user_email',
                'user_mobile',
                'user_login_id',
                'user_password',
                'confirm_password',
              ]);
            } catch (error) {
              return;
            }
          }}
          loading={loading}
        >
          {t('signup')}
        </SpecialButton>
      </Row>
    </div>
  );
}

const input = css`
  height: 44px;
  border-radius: 8px;
`;

export default UserStep;
