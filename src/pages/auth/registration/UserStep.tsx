import userAPI from '@apis/userAPI';
import { PhoneAuthModal } from '@components/combine';
import { Button, Form, Input, message, Row, Space } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useSearchParams } from 'react-router-dom';

interface Props {
  visible: boolean;
  loading: boolean;
  onClickPrev: () => void;
  form: FormInstance;
}

function UserStep({ visible, loading, onClickPrev, form }: Props) {
  const [searchParams] = useSearchParams();

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
  const handleUserLoginIdValidationCheck = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('아이디를 입력해주세요.'));
    }

    if (!checkDuplicated && form.getFieldValue('user_login_id')) {
      return Promise.reject(new Error('아이디 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  // 비밀번호 확인 유효성 검사
  const handleConfirmPasswordValidationCheck = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('비밀번호 입력해주세요.'));
    }

    if (value && value !== form.getFieldValue('user_password')) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }

    return Promise.resolve();
  };

  return (
    <div style={{ display: visible ? '' : 'none' }}>
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
      <Form.Item
        name="user_name"
        label={t('user name')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="user_email"
        label={t('email')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t('phone')} required={true}>
        <Space>
          <Form.Item
            noStyle
            name="user_mobile"
            rules={[{ required: true, message: '휴대번호를 인증해주세요' }]}
          >
            <Input
              style={{ width: 400 }}
              readOnly
              onClick={() => setPhoneAuthModalVisible(true)}
            />
          </Form.Item>
          <Button
            style={{ fontSize: 13 }}
            onClick={() => setPhoneAuthModalVisible(true)}
            size="middle"
            type="primary"
          >
            휴대 전화번호 인증하기
          </Button>
        </Space>
      </Form.Item>
      <Form.Item label={t('id')} required={true}>
        <Space>
          <Form.Item
            noStyle
            name="user_login_id"
            rules={[{ validator: handleUserLoginIdValidationCheck }]}
          >
            <Input
              style={{ width: 400 }}
              onChange={() => {
                setCheckDuplicated(false);
              }}
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldError, getFieldValue }) => (
              <Button
                style={{ fontSize: 13 }}
                size="middle"
                type="primary"
                disabled={
                  !getFieldValue('user_login_id') ||
                  getFieldError('user_login_id').includes(
                    '아아디를 입력해 주세요.',
                  ) ||
                  checkDuplicated
                }
                onClick={() => {
                  dupCheckQuery.mutate({
                    login_id: getFieldValue('user_login_id'),
                    encrypted_text: searchParams.get('encrypted_text')!,
                  });
                }}
              >
                {t('duplicate check')}
              </Button>
            )}
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item
        name="user_password"
        label={t('password')}
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label={t('confirm password')}
        dependencies={['user_password']}
        required={true}
        rules={[{ validator: handleConfirmPasswordValidationCheck }]}
      >
        <Input.Password />
      </Form.Item>

      <Row justify="space-between">
        <Button style={{ width: '48%' }} onClick={onClickPrev}>
          {t('prev')}
        </Button>
        <Button
          style={{ width: '48%' }}
          htmlType="submit"
          type="primary"
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
              console.log(error);
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

export default UserStep;
