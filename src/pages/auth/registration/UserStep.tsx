import userAPI from '@apis/userAPI';
import { PhoneAuthModal } from '@components/combine';
import { Button, Form, Input, message, Row } from 'antd';
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
  const [isDuplicated, setIsDuplicated] = useState(true);

  // 아이디 중복체크 요청
  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
    onSuccess: () => {
      message.success(t('message.no duplicate values'));
      setIsDuplicated(false);
      form.setFields([
        {
          name: 'user_login_id',
          errors: [],
        },
      ]);
    },
    onError: (data: AxiosError) => {
      message.warn(data.response?.data.msg);
      setIsDuplicated(true);
    },
  });

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
      <Form.Item
        name="user_mobile"
        label={t('phone')}
        hasFeedback
        validateStatus="success"
        rules={[{ required: true }]}
      >
        <Input
          readOnly
          suffix={
            <Button
              size="small"
              type="link"
              onClick={() => setPhoneAuthModalVisible(true)}
            >
              {t('auth phone')}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item
        name="user_login_id"
        label={t('id')}
        hasFeedback
        validateStatus={isDuplicated ? '' : 'success'}
        rules={[
          { required: true },
          () => ({
            validator() {
              if (isDuplicated) {
                return Promise.reject(new Error('아이디 중복확인을 해주세요'));
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input
          onChange={() => {
            setIsDuplicated(true);
          }}
          suffix={
            <Button
              size="small"
              type="link"
              onClick={() => {
                dupCheckQuery.mutate({
                  login_id: form.getFieldValue('user_login_id'),
                  encrypted_text: searchParams.get('encrypted_text')!,
                });
              }}
            >
              {t('duplicate check')}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item
        name="user_password"
        label={t('password')}
        rules={[{ required: true }]}
      >
        <Input.Password name="password" />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label={t('confirm password')}
        dependencies={['user_password']}
        hasFeedback
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (value !== getFieldValue('user_password')) {
                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다.'),
                );
              }

              return Promise.resolve();
            },
          }),
        ]}
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
