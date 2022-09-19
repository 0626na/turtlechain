import { css } from '@emotion/react';
import { Input, InputProps } from 'antd';
import React from 'react';
interface Props extends InputProps {
  textAlign?: 'left' | 'right';
}

function TurtleTableInput({ textAlign = 'left', ...props }: Props) {
  return <Input css={[input, { textAlign }]} {...props} />;
}

const input = css`
  height: 24px;
  text-align: right;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export default TurtleTableInput;
