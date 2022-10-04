import userAPI from '@apis/userAPI';
import { PhoneAuthModal } from '@components/combine';
import { css } from '@emotion/react';
import { Button, Form, FormInstance, Input, message, Row } from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  loading: boolean;
  onClickPrev: () => void;
  form: FormInstance;
}

function UserStep({ visible, loading, onClickPrev, form }: Props) {
  const [phoneAuthModalVisible, setPhoneAuthModalVisible] = useState(false);
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
      {/*
       *  휴대전화 번호 인증 모달
       */}
      <PhoneAuthModal
        visible={phoneAuthModalVisible}
        onClose={() => setPhoneAuthModalVisible(false)}
        onSuccess={(data) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            user_mobile: data.phone,
          });
        }}
      />

      {/* <Form.Item
        css={marginBottom}
        name="company_biz_type"
        label={t('biz role')}
        rules={[{ required: true }]}
      >
        <Radio.Group>
          {['entity', 'personal', 'simple'].map((option) => (
            <Radio key={option} value={option}>
              {t(`biz ${option}`)}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item> */}

      <Form.Item
        css={marginBottom}
        name="user_name"
        label={t('user name')}
        rules={[{ required: true }]}
      >
        <Input css={input} />
      </Form.Item>

      <Form.Item
        css={marginBottom}
        name="user_email"
        label={t('email')}
        rules={[{ required: true }]}
      >
        <Input css={input} />
      </Form.Item>

      <Form.Item css={marginBottom} label={t('phone')} required={true}>
        <Form.Item
          noStyle
          name="user_mobile"
          rules={[{ required: true, message: '휴대번호를 인증해주세요.' }]}
        >
          <Input
            css={input}
            readOnly
            onClick={() => setPhoneAuthModalVisible(true)}
            suffix={
              <Button
                css={{ color: '#1A66F9', '&:hover': { color: '#1A66F9' } }}
                type="link"
                onClick={() => setPhoneAuthModalVisible(true)}
              >
                인증하기
              </Button>
            }
          />
        </Form.Item>
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldError, getFieldValue }) => (
          <Form.Item
            css={marginBottom}
            label={t('id')}
            name="user_login_id"
            required
            rules={[{ validator: idValidation }]}
          >
            <Input
              css={input}
              onChange={() => {
                setCheckDuplicated(false);
              }}
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
        css={marginBottom}
        name="user_password"
        label={t('password')}
        rules={[{ required: true }]}
      >
        <Input.Password css={input} />
      </Form.Item>
      <Form.Item
        css={marginBottom}
        name="confirm_password"
        label={t('confirm password')}
        dependencies={['user_password']}
        required={true}
        rules={[{ validator: passwordValidation }]}
      >
        <Input.Password css={input} />
      </Form.Item>

      <Row css={{ marginTop: 40 }}>
        <Button
          css={button}
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
        </Button>
      </Row>
    </div>
  );
}

const input = css`
  height: 44px;
  border-radius: 8px;
`;

const button = css`
  width: 352px;
  height: 48px;

  font-weight: 700;
  border: none;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    background-color: #00b3be;
    border-color: #00b3be;
  }
`;

const marginBottom = css({
  marginBottom: 28,
});

export default UserStep;
