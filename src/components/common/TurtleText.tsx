import { Typography } from "antd";
import styled from "styled-components";

interface Props {
  children: React.ReactChild;
}

function TurtleText({ children }: Props) {
  return <StyledText>{children}</StyledText>;
}

const StyledText = styled(Typography.Text)`
  display: block;
  margin-bottom: 1.5rem;
  font-size: 15px;
`;

export default TurtleText;
