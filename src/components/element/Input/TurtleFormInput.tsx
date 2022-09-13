import { InputProps } from 'antd';
import { Input } from 'antd';
import { css } from '@emotion/react';

interface Props extends InputProps {}

function TurtleFormInput({ ...props }: Props) {
  return <Input {...props} css={input} />;
}

const input = css`
  display: inline-block;
  height: 36px;

  padding: 11px 12px;

  color: #242934;
  border: 1px solid #cbccd1;

  border-radius: 8px;

  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

  background-color: #fcfcfc;

  // hover, focus시에도 default와 동일하게 맞춰준다.
  &.ant-input:focus,
  &.ant-input:hover {
    border-color: #cbccd1;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  }

  // disabled 처리
  &.ant-input[disabled] {
    color: #a1a2a6;

    border: 1px solid #cbccd1;

    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
    background-color: #f6f7f8;
  }
`;

export default TurtleFormInput;
