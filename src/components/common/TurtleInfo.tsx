import { Row, Typography } from "antd";
import styled from "styled-components";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";

interface Props {
  children: React.ReactChild;
}

function TurtleInfo({ children }: Props) {
  return (
    <StyledRow>
      <Typography.Text type="secondary" style={{ fontSize: "14px" }}>
        <InfoIcon /> {children}
      </Typography.Text>
    </StyledRow>
  );
}

const StyledRow = styled(Row)`
  padding-top: 0 !important;
`;

export default TurtleInfo;
