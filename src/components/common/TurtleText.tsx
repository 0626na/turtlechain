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
  font-size: 18px;
`;

export default TurtleText;
