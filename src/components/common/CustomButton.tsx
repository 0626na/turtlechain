import { Button } from "antd";
import styled from "styled-components";

interface Props {
  children?: React.ReactChild;
  type?: "primary";
  color?: "grey" | "skyBlue";
}

function CustomButton({ children, type, color }: Props) {
  return (
    <StyledButton shape="round" type={type} color={color}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled(Button)`
  background-color: ${({ theme, type, color }) =>
    type && color && theme[color + "Button"]};
  border: ${({ type }) => type && 0};
`;

export default CustomButton;
