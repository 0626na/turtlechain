import { Button } from "antd";
import { TFunctionResult } from "i18next";
import styled from "styled-components";

interface Props {
  children: TFunctionResult;
  type?: "primary" | "default";
  color?: "grey" | "skyBlue" | "mint";
  htmlType?: "submit";
  size?: "small";
  onClick?: () => void;
}

function TurtleButton({ children, type = "primary", color, htmlType, size, onClick }: Props) {
  return (
    <StyledButton
      shape="round"
      type={type}
      color={color}
      htmlType={htmlType}
      size={size}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  background-color: ${({ theme, color }) => color && theme[color + "Button"]};
  border: ${({ theme, color }) => color && theme[color + "Button"]};
  &:hover {
    background-color: ${({ theme, color }) => color && theme[color + "Button"]};
    opacity: 0.8;
  }
  &:focus {
    background-color: ${({ theme, color }) => color && theme[color + "Button"]};
    opacity: 0.8;
  }
`;

export default TurtleButton;
