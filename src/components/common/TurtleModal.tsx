import Modal from "antd/lib/modal/Modal";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

interface Props {
  [x: string]: any;
}

function TurtleModal({ ...rest }: Props) {
  return <StyledModal closeIcon={<CloseOutlined style={{ color: "#ffffff" }} />} {...rest} />;
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #2b3140;
  }
  .ant-modal-title {
    color: #ffffff;
  }
`;

export default TurtleModal;
