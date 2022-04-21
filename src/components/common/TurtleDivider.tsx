import { Divider, DividerProps } from "antd";
import styled from "styled-components";

function TurtleDivider({ ...props }: DividerProps) {
  return <StyledDivider {...props} />;
}

const StyledDivider = styled(Divider)`
  border-top-color: rgba(0, 0, 0, 0.06);
`;

export default TurtleDivider;
