import { Button } from 'antd';
import TurtleText from '../TurtleText';
import { css } from '@emotion/react';
import PreventMultipleClickButton from './PreventMultipleClickButton';

interface Props {
  text: string;
  type?: 'YES' | 'NO';
  margin?: string;

  disabled?: boolean;
  loading?: boolean;
  htmlType?: 'submit';
  onClick?: () => void;
}

function AnswerButton({
  text,
  type = 'YES',
  margin,
  loading,
  ...props
}: Props) {
  if (type === 'NO') {
    return (
      <PreventMultipleClickButton
        loading={Boolean(loading)}
        css={[falsy, { margin: margin }]}
        {...props}
      >
        <TurtleText>{text}</TurtleText>
      </PreventMultipleClickButton>
      // <Button css={[falsy, { margin: margin }]} {...props}>
      //   <TurtleText>{text}</TurtleText>
      // </Button>
    );
  }

  // type === YES
  return (
    <PreventMultipleClickButton
      loading={Boolean(loading)}
      css={[falsy, { margin: margin }]}
      {...props}
    >
      <TurtleText>{text}</TurtleText>
    </PreventMultipleClickButton>
    // <Button css={[truthy, { margin: margin }]} {...props}>
    //   <TurtleText>{text}</TurtleText>
    // </Button>
  );
}

const falsy = css`
  min-width: 66px;
  height: 36px;

  font-weight: 500;
  color: #6b6d73;
  background-color: #f0f3f6;

  &:hover {
    color: #6b6d73;
    background-color: #d9dbde;
  }

  // active 상태
  &.ant-btn:focus {
    color: #6b6d73;
    background-color: #f0f3f6;
    border-color: #f0f3f6;
  }
`;

const truthy = css`
  min-width: 66px;
  height: 36px;

  font-weight: 500;
  color: #ffffff;
  background-color: #1a66f9;

  &:hover {
    color: #ffffff;
    background-color: #1553ca;
    border-color: #1553ca;
  }

  // active 상태
  &.ant-btn:focus {
    color: #ffffff;
    background-color: #1a66f9;
  }

  &.ant-btn[disabled] {
    color: #ffffff;
    background: #1a66f9;
    opacity: 0.6;
  }
`;

export default AnswerButton;
