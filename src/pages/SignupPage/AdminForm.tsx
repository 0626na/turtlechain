import styled from "styled-components";
import { useState } from "react";
import { Admin } from "pages/SignupPage";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { userAPI } from "apis";
// antd
import { Button, Form, Input, message } from "antd";
// constant
import { NO_DUPLICATE_VALUES } from "constant/message";
import {
  PHONE,
  AUTH_PHONE,
  USER_NAME,
  ID,
  EMAIL,
  PASSWORD,
  CONFIRM_PASSWORD,
  PREV,
  SIGN_UP,
  DUPLICATE_CHECK,
} from "constant/string";
// components
import PhoneAuthModal from "components/PhoneAuthModal";

interface Props {
  admin: Admin;
  setAdmin: React.Dispatch<React.SetStateAction<Admin>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

const AdminForm = function ({
  admin,
  setAdmin,
  setCurrentStep,
  isSubmitting,
  onSubmit,
}: Props) {
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
      message.success(NO_DUPLICATE_VALUES);
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
    setAdmin({ ...admin, mobile_tel: phone });
  };

  // text change 이벤트
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  // 아이디 중복 체크
  const onDupCheck = () => {
    if (admin.login_id) {
      idDupCheck.mutate({ id: admin.login_id });
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
          label={PHONE}
          hasFeedback
          validateStatus={admin.mobile_tel ? "success" : ""}
        >
          <Input
            readOnly
            disabled
            name="mobile_tel"
            value={admin.mobile_tel}
            suffix={
              <Button type="link" onClick={openAuthModal}>
                {AUTH_PHONE}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={USER_NAME}>
          <Input //
            name="name"
            value={admin.name}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={EMAIL}>
          <Input //
            name="email"
            value={admin.email}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item
          label={ID}
          hasFeedback
          validateStatus={isDupChecked ? "success" : ""}
        >
          <Input //
            name="login_id"
            value={admin.login_id}
            onChange={handleTextChange}
            suffix={
              <Button type="link" onClick={onDupCheck}>
                {DUPLICATE_CHECK}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={PASSWORD}>
          <Input.Password //
            name="password"
            value={admin.password}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={CONFIRM_PASSWORD}>
          <Input.Password //
            name="confirmPassword"
            value={admin.confirmPassword}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item>
          <HorizontalContainer>
            <Button block onClick={handlePrev}>
              {PREV}
            </Button>
            <Button
              block
              type="primary"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              {SIGN_UP}
            </Button>
          </HorizontalContainer>
        </Form.Item>
      </Form>
    </>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * + * {
    margin-left: 20px;
  }
`;

export default AdminForm;
