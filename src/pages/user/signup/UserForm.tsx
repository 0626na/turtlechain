import styled from 'styled-components';
import { t } from 'i18next';
import { useState, useMemo, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { PhoneAuthModal } from '@components/combine';
import { User } from '.';
import userAPI from '@apis/userAPI';

interface Props {
  user: User;
  isSubmitting: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  onPrev: () => void;
  onSignup: () => void;
}

function UserForm({ user, isSubmitting, setUser, onPrev, onSignup }: Props) {
  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 아이디 중복체크 요청
  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      message.success(t('message.no duplicate values'));
      setIsDuplicated(false);
    },
  });

  // 아이디 입력 값 변경하면 중복체크 완료 해제
  useEffect(() => {
    setIsDuplicated(true);
  }, [user.login_id]);

  const signupDisabled = useMemo(() => {
    const { name, email, mobile_phone, password } = user;
    if (
      !email ||
      !name ||
      !mobile_phone ||
      isDuplicated ||
      !password ||
      password !== confirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  }, [user, confirmPassword]);

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={() => setVisiblePhoneAuthModal(false)}
        onSuccess={(data) => {
          setUser({ ...user, mobile_phone: data.phone });
        }}
      />
      <Form layout="vertical">
        <Form.Item label={t('user name')}>
          <Input //
            name="name"
            value={user.name}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('email')}>
          <Input //
            name="email"
            value={user.email}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item
          label={t('phone')}
          hasFeedback
          validateStatus={user.mobile_phone ? 'success' : ''}
        >
          <Input
            readOnly
            value={user.mobile_phone}
            suffix={
              <Button
                size="small"
                type="link"
                onClick={() => setVisiblePhoneAuthModal(true)}
              >
                {t('auth phone')}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label={t('id')}
          hasFeedback
          validateStatus={!isDuplicated ? 'success' : ''}
        >
          <Input
            name="login_id"
            value={user.login_id}
            onChange={handleChangeText}
            suffix={
              <Button
                size="small"
                type="link"
                onClick={() =>
                  dupCheckQuery.mutate({ login_id: user.login_id })
                }
              >
                {t('duplicate check')}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t('password')}>
          <Input.Password
            name="password"
            value={user.password}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t('confirm password')}>
          <Input.Password
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <ButtonContainer>
            <Button block onClick={onPrev}>
              {t('prev')}
            </Button>
            <Button
              block
              type="primary"
              disabled={signupDisabled}
              loading={isSubmitting}
              onClick={onSignup}
            >
              {t('signup')}
            </Button>
          </ButtonContainer>
        </Form.Item>
      </Form>
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * + * {
    margin-left: 20px;
  }
`;

export default UserForm;
