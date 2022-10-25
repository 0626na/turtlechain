import { InputProps } from 'antd';
import { Input } from 'antd';
import { css } from '@emotion/react';

function TurtleTableInput({ ...props }: InputProps) {
  return <Input {...props} css={input} />;
}

const input = css`
  height: 24px;
  width: 100%;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export default TurtleTableInput;
