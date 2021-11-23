import styled from "styled-components";
import { useState, useMemo } from "react";
import { User } from "pages/SignupPage";
// antd
import { Button, Form, Input } from "antd";
// lang
import { useTranslation } from "react-i18next";
// components
import PhoneAuthModal from "components/PhoneAuthModal";

interface Props {
  user: User;
  isSubmitting: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  onPrev: () => void;
  onSignup: () => void;
}

const UserForm = function ({
  user,
  isSubmitting,
  setUser,
  onPrev,
  onSignup,
}: Props) {
  const { t } = useTranslation();
  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const signupDisabled = useMemo(() => {
    const { name, email, mobile_tel, password, confirmPassword } = user;
    if (
      !email ||
      !name ||
      !mobile_tel ||
      !password ||
      password !== confirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  }, [user]);

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={() => setVisiblePhoneAuthModal(false)}
        onSuccess={(data) => {
          setUser({ ...user, mobile_tel: data.phone });
        }}
      />
      <Form layout="vertical">
        <Form.Item label={t("user name")}>
          <Input //
            name="name"
            value={user.name}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t("email")}>
          <Input //
            name="email"
            value={user.email}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item
          label={t("phone")}
          hasFeedback
          validateStatus={user.mobile_tel ? "success" : ""}
        >
          <Input
            readOnly
            value={user.mobile_tel}
            suffix={
              <Button
                type="link"
                onClick={() => setVisiblePhoneAuthModal(true)}
              >
                {t("auth phone")}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t("id")}>
          <Input
            name="login_id"
            value={user.login_id}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t("password")}>
          <Input.Password
            name="password"
            value={user.password}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item label={t("confirm password")}>
          <Input.Password
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChangeText}
          />
        </Form.Item>
        <Form.Item>
          <ButtonContainer>
            <Button block onClick={onPrev}>
              {t("prev")}
            </Button>
            <Button
              block
              type="primary"
              disabled={signupDisabled}
              loading={isSubmitting}
              onClick={onSignup}
            >
              {t("signup")}
            </Button>
          </ButtonContainer>
        </Form.Item>
      </Form>
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * + * {
    margin-left: 20px;
  }
`;

export default UserForm;
