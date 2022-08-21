import { Button } from 'antd';
import styled from 'styled-components';
import TurtleImg from '../TurtleImg';
import { ReactComponent as DownloadIcon } from '../../../assets/icon/download.svg';
import TurtleText from '../TurtleText';
interface Props {
  size?: 'small' | 'middle' | 'large';
  text: string;

  width?: number;
  height?: number;
  fontWeight?: number;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function TeriaryButton({
  size,
  text,

  fontWeight = 700,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  htmlType,
  onClick,
}: Props) {
  const style = {
    fontWeight,
  };

  if (size === 'middle') {
    return (
      <StyledButton
        style={{ width: 160, height: 40, ...style }}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
      >
        {/* <DownloadIcon /> */}
        {/* <IconContainer>
        <TurtleImg name="plus" />
      </IconContainer> */}
        <TurtleText style={{ marginLeft: 5 }}>{text}</TurtleText>

        {/* <IconContainer>
        <TurtleImg name="plus" />
      </IconContainer> */}
        {/* <DownloadIcon /> */}
      </StyledButton>
    );
  }
  1;

  if (size === 'small') {
    return (
      <StyledButton
        style={style}
        loading={loading}
        onClick={onClick}
        disabled={false}
        htmlType={htmlType}
      >
        {/* <DownloadIcon /> */}
        {/* <IconContainer>
        <TurtleImg name="plus" />
      </IconContainer> */}
        <TurtleText style={{ marginLeft: 5 }}>{text}</TurtleText>

        {/* <IconContainer>
        <TurtleImg name="plus" />
      </IconContainer> */}
        {/* <DownloadIcon /> */}
      </StyledButton>
    );
  }
}

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0px;
  border: none;
  color: #00aab5;
  stroke: #00aab5;
  background-color: #ddf3f5;

  &:hover {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #d4e9eb;
  }

  &.ant-btn:focus {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
  }

  &.ant-btn[disabled] {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
    opacity: 0.5;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;
export default TeriaryButton;
