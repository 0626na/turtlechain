import styled from "styled-components";
import { Modal, Form, Input, Button } from "antd";
import {
  AUTH_PHONE,
  PHONE,
  CREATE_AUTH_NUM,
  VERIFY_AUTH_NUM,
  AUTH_NUM,
  CLOSE,
} from "constant/string";

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
      title={AUTH_PHONE}
      width={400}
      closable={false}
      visible={visible}
      footer={[<Button onClick={onClose && onClose}>{CLOSE}</Button>]}
    >
      <Form>
        <Form.Item>
          <ActionContainer>
            <Input placeholder={PHONE} />
            <Button type="primary">{CREATE_AUTH_NUM}</Button>
          </ActionContainer>
        </Form.Item>
        <Form.Item>
          <Input placeholder={AUTH_NUM} />
        </Form.Item>
        <Form.Item>
          <Button block type="primary">
            {VERIFY_AUTH_NUM}
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
