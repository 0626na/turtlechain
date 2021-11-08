import styled from "styled-components";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import {
  PHONE,
  AUTH_PHONE,
  USER_NAME,
  ID,
  EMAIL,
  PASSWORD,
  CONFIRM_PASSWORD,
  PREV,
  NEXT,
} from "constant/string";
import PhoneAuthModal from "components/PhoneAuthModal";

interface Props {
  onPrevStep: () => void;
  onNextStep: () => void;
}

const AdminForm = function ({ onPrevStep, onNextStep }: Props) {
  const [form] = Form.useForm();
  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);

  // 인증 모달 열기
  const openAuthModal = () => {
    setVisiblePhoneAuthModal(true);
  };

  // 인증 모달 닫기
  const closeAuthModal = () => {
    setVisiblePhoneAuthModal(false);
  };

  // 이전 단계
  const handlePrev = () => {
    onPrevStep();
  };

  // 다음 단계
  const handleNext = () => {
    onNextStep();
  };

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={closeAuthModal}
      />
      <Form form={form} layout="vertical">
        <Form.Item label={PHONE}>
          <Button type="primary" onClick={openAuthModal}>
            {AUTH_PHONE}
          </Button>
        </Form.Item>
        <Form.Item label={USER_NAME}>
          <Input />
        </Form.Item>
        <Form.Item label={EMAIL}>
          <Input />
        </Form.Item>
        <Form.Item label={ID}>
          <Input />
        </Form.Item>
        <Form.Item label={PASSWORD}>
          <Input />
        </Form.Item>
        <Form.Item label={CONFIRM_PASSWORD}>
          <Input />
        </Form.Item>
        <Form.Item>
          <HorizontalContainer>
            <Button block onClick={handlePrev}>
              {PREV}
            </Button>
            <Button block type="primary" onClick={handleNext}>
              {NEXT}
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
