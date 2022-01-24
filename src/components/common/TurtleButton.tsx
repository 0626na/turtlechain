import { Button } from "antd";
import { TFunctionResult } from "i18next";
import styled from "styled-components";

interface Props {
  children: TFunctionResult;
  type?: "primary" | "default" | "ghost";
  color?: "grey" | "mint";
  htmlType?: "submit";
  size?: "small";
  ghost?: boolean;
  onClick?: () => void;
}

function TurtleButton({
  children,
  type = "primary",
  color,
  htmlType,
  size,
  ghost,
  onClick,
}: Props) {
  return (
    <StyledButton
      type={type}
      color={color}
      htmlType={htmlType}
      size={size}
      ghost={ghost}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  border-radius: 4px;
  background-color: ${({ theme, color }) => {
    return color && theme[color + "Button"];
  }};
  border: ${({ theme, color }) => {
    return color && theme[color + "Button"];
  }};
  &:hover {
    background-color: ${({ theme, color }) => {
      if (color === "grey") return theme.skyBlueButton;
      return color && theme[color + "Button"];
    }};
    opacity: ${({ color }) => {
      if (color !== "grey") return "0.8";
    }};
  }
  &:focus {
    background-color: ${({ theme, color }) => {
      if (color === "grey") return theme.skyBlueButton;
      return color && theme[color + "Button"];
    }};
    opacity: ${({ color }) => {
      if (color !== "grey") return "0.8";
    }};
  }
`;

export default TurtleButton;
