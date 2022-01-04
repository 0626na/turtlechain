import { Divider } from "antd";
import styled from "styled-components";

function CustomDivider() {
  return <StyledDivider />;
}

const StyledDivider = styled(Divider)`
  padding: 0;
  margin: 0;
`;

export default CustomDivider;
