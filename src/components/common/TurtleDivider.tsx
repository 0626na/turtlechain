import { Divider } from "antd";
import styled from "styled-components";

function TurtleDivider() {
  return <StyledDivider />;
}

const StyledDivider = styled(Divider)`
  border-top-color: rgba(0, 0, 0, 0.06);
  padding: 0;
  margin: 0;
`;

export default TurtleDivider;
