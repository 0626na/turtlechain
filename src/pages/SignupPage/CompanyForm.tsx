import styled from "styled-components";
import { useState } from "react";
import {
  BUSINESS_NAME,
  BUSINESS_NUMBER,
  BUSINESS_ADDRESS,
  BUSINESS_LICENSE,
  FIND_ADDRESS,
  DETAIL_ADDRESS,
  ETC,
  PREV,
  NEXT,
} from "constant/string";
import { IMAGE_FORM_DESCRIPTION } from "constant/description";
import { FileImageOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Typography } from "antd";
import PostcodeModal from "components/DaumPostcodeModal";

interface Props {
  onNextStep: () => void;
}

const CompanyForm = function ({ onNextStep }: Props) {
  const [form] = Form.useForm();
  const [visiblePostcodeModal, setVisiblePostcodeModal] = useState(false);

  // 주소 찾기 모달 열기
  const openPostcodeModal = () => {
    setVisiblePostcodeModal(true);
  };

  // 주소 찾기 모달 닫기
  const closePostcodeModal = () => {
    setVisiblePostcodeModal(false);
  };

  // 이전 단계
  const handlePrev = () => {
    onNextStep();
  };

  // 다음 단계
  const handleNext = () => {
    onNextStep();
  };

  return (
    <>
      <PostcodeModal
        visible={visiblePostcodeModal}
        onClose={closePostcodeModal}
      />
      <Form form={form} layout="vertical">
        <Form.Item label={BUSINESS_NAME}>
          <Input />
        </Form.Item>
        <Form.Item label={BUSINESS_NUMBER}>
          <Input />
        </Form.Item>
        <Form.Item label={BUSINESS_ADDRESS}>
          <HorizontalContainer>
            <Input readOnly />
            <Button type="primary" onClick={openPostcodeModal}>
              {FIND_ADDRESS}
            </Button>
          </HorizontalContainer>
        </Form.Item>
        <Form.Item>
          <Input placeholder={DETAIL_ADDRESS} />
        </Form.Item>
        <Form.Item label={BUSINESS_LICENSE}>
          <Upload.Dragger>
            <ImageIcon />
            <Typography.Text>{IMAGE_FORM_DESCRIPTION}</Typography.Text>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item label={ETC}>
          <Input.TextArea style={{ height: 150 }} />
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

const ImageIcon = styled(FileImageOutlined)`
  font-size: 3rem;
  display: block;
  margin: 20px 0;
`;

export default CompanyForm;
