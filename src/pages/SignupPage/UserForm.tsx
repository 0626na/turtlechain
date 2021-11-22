import styled from "styled-components";
import { useState } from "react";
import { User } from "pages/SignupPage";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { userAPI } from "apis";
// antd
import { Button, Form, Input, message } from "antd";
// lang
import { useTranslation } from "react-i18next";
// components
import PhoneAuthModal from "components/PhoneAuthModal";

interface Props {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

const UserForm = function ({
  user,
  setUser,
  setCurrentStep,
  isSubmitting,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);
  const [isDupChecked, setIsDupChecked] = useState(false);

  // 아이디 중복 체크 요청
  const idDupCheck = useMutation(["idDupCheck"], userAPI.dupCheck, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
      setIsDupChecked(false);
    },
    onSuccess: () => {
      message.success(t("message.no duplicate values"));
      setIsDupChecked(true);
    },
  });

  // 인증 모달 열기
  const openAuthModal = () => {
    setVisiblePhoneAuthModal(true);
  };

  // 인증 모달 닫기
  const closeAuthModal = () => {
    setVisiblePhoneAuthModal(false);
  };

  // 휴대번호 인증 성공 콜백
  const onPhoneAuthSuccess = (data: { phone: string; token: string }) => {
    const { phone } = data;
    setUser({ ...user, mobile_tel: phone });
  };

  // text change 이벤트
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 아이디 중복 체크
  const onDupCheck = () => {
    if (user.login_id) {
      idDupCheck.mutate({ id: user.login_id });
    }
  };

  // 이전 단계
  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // 다음 단계
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={closeAuthModal}
        onSuccess={onPhoneAuthSuccess}
      />
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("phone")}
          hasFeedback
          validateStatus={user.mobile_tel ? "success" : ""}
        >
          <Input
            readOnly
            disabled
            name="mobile_tel"
            value={user.mobile_tel}
            suffix={
              <Button type="link" onClick={openAuthModal}>
                {t("auth phone")}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t("user name")}>
          <Input //
            name="name"
            value={user.name}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={t("email")}>
          <Input //
            name="email"
            value={user.email}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item
          label={t("id")}
          hasFeedback
          validateStatus={isDupChecked ? "success" : ""}
        >
          <Input //
            name="login_id"
            value={user.login_id}
            onChange={handleTextChange}
            suffix={
              <Button type="link" onClick={onDupCheck}>
                {t("duplicate check")}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t("password")}>
          <Input.Password //
            name="password"
            value={user.password}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={t("confirm password")}>
          <Input.Password //
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item>
          <ButtonContainer>
            <Button block onClick={handlePrev}>
              {t("prev")}
            </Button>
            <Button
              block
              type="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              {t("next")}
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
