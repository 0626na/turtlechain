import userAPI from '@apis/userAPI';
import { PhoneAuthModal } from '@components/combine';
import { Button, Form, Input, message, Row } from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  loading: boolean;
  onClickPrev: () => void;
}

function UserStep({ visible, loading, onClickPrev }: Props) {
  const form = Form.useFormInstance();
  const [phoneAuthModalVisible, setPhoneAuthModalVisible] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(true);
  const name = Form.useWatch('user_name');
  const email = Form.useWatch('user_email');
  const mobile = Form.useWatch('user_mobile');
  const loginId = Form.useWatch('user_login_id');
  const password = Form.useWatch('user_password');
  const confirmPassword = Form.useWatch('confirm_password');

  // 아이디 중복체크 요청
  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
    onSuccess: () => {
      message.success(t('message.no duplicate values'));
      setIsDuplicated(false);
    },
    onError: (data: AxiosError) => {
      message.warn(data.response?.data.msg);
      setIsDuplicated(true);
    },
  });

  useEffect(() => {
    setIsDuplicated(true);
  }, [loginId]);

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
      <Form.Item name="user_name" label={t('user name')}>
        <Input />
      </Form.Item>
      <Form.Item name="user_email" label={t('email')}>
        <Input />
      </Form.Item>
      <Form.Item
        name="user_mobile"
        label={t('phone')}
        hasFeedback
        validateStatus={mobile ? 'success' : ''}
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
      >
        <Input
          suffix={
            <Button
              size="small"
              type="link"
              onClick={() =>
                dupCheckQuery.mutate({
                  login_id: form.getFieldValue('user_login_id'),
                })
              }
            >
              {t('duplicate check')}
            </Button>
          }
        />
      </Form.Item>
      <Form.Item name="user_password" label={t('password')}>
        <Input.Password name="password" />
      </Form.Item>
      <Form.Item name="confirm_password" label={t('confirm password')}>
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
          disabled={
            !(
              name &&
              email &&
              mobile &&
              loginId &&
              !isDuplicated &&
              password &&
              confirmPassword &&
              password === confirmPassword
            )
          }
          loading={loading}
        >
          {t('signup')}
        </Button>
      </Row>
    </div>
  );
}

export default UserStep;
