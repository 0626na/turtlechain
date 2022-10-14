import { css } from '@emotion/react';

import { Input, InputProps } from 'antd';

interface Props extends InputProps {
  defaultValue?: string;
}

function TurtleTablePhoneNumberInput({ defaultValue, ...props }: Props) {
  return (
    <Input
      {...props}
      maxLength={13}
      css={input}
      size="small"
      defaultValue={defaultValue}
    />
  );
}

const input = css`
  height: 24px;
  border: 1px solid #d6d7da;
  border-radius: 4px;
`;

export default TurtleTablePhoneNumberInput;
