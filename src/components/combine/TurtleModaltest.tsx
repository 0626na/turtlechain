import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

interface Props extends ModalProps {
  children?: React.ReactNode;
}

function TurtleModaltest({ children, ...props }: Props) {
  return (
    <StyledModal
      {...props}
      //   closeIcon={<CloseOutlined style={{ color: '#ffffff' }} />}
    >
      {children}
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #2b3140;
  }
  .ant-modal-title {
    color: #ffffff;
  }
`;

export default TurtleModaltest;
