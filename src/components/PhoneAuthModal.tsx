import styled from "styled-components";
import { Modal, Form, Input, Button } from "antd";

interface SuccessData {
  phone: string;
  token: string;
}

interface Props {
  visible: boolean;
  onClose?: () => void; // 모달창 닫기
  onSuccess?: (data: SuccessData) => void; // 인증 성공 콜백
}

const PhoneAuthModal = function ({ visible, onClose, onSuccess }: Props) {
  return (
    <Modal
      title="휴대번호 인증"
      width={400}
      closable={false}
      visible={visible}
      footer={[<Button onClick={onClose && onClose}>닫기</Button>]}
    >
      <Form>
        <Form.Item>
          <ActionContainer>
            <Input placeholder="휴대번호" />
            <Button type="primary">인증번호 전송</Button>
          </ActionContainer>
        </Form.Item>
        <Form.Item>
          <Input placeholder="인증번호" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary">
            인증번호 확인
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ActionContainer = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default PhoneAuthModal;
