import { Typography } from "antd";
import { TFunctionResult } from "i18next";
import styled from "styled-components";

interface Props {
  children: TFunctionResult;
}

function TurtleText({ children }: Props) {
  return <StyledText>{children}</StyledText>;
}

const StyledText = styled(Typography.Text)`
  display: block;
  margin-bottom: 1.5rem;
  font-size: 16px;
`;

export default TurtleText;
