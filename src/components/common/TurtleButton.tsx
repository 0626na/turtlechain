import { Button } from "antd";
import styled from "styled-components";

interface Props {
  children?: React.ReactChild;
  type?: "primary";
  color?: "grey" | "skyBlue";
  htmlType?: "submit";
}

function TurtleButton({ children, type, color, htmlType }: Props) {
  return (
    <StyledButton shape="round" type={type} color={color} htmlType={htmlType}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  background-color: ${({ theme, type, color }) =>
    type === "primary" && color && theme[color + "Button"]};
  border: ${({ type }) => type && 0};
`;

export default TurtleButton;
