import { css } from '@emotion/react';
import { Button } from 'antd';
import React from 'react';
import TurtleIcon from '../icon/TurtleIcon';

interface Props {
  onClick: () => void;
  isDuplicated?: boolean;
  isEmpty?: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

function CheckDuplicatedButton({
  onClick,
  isDuplicated,
  isEmpty,
  children,
  isLoading,
}: Props) {
  return (
    <Button
      loading={isLoading}
      css={{ color: '#1A66F9', '&:hover': { color: '#1A66F9' } }}
      type="link"
      disabled={isEmpty}
      onClick={onClick}
    >
      <div css={authCheckCss.container}>
        {children}
        {isDuplicated && (
          <span css={authCheckCss.icon}>
            <TurtleIcon name="checkMark" />
          </span>
        )}
      </div>
    </Button>
  );
}

const authCheckCss = {
  container: css({
    display: 'flex',
    alignItems: 'center',
  }),
  icon: css({
    marginLeft: 4,
  }),
};

export default CheckDuplicatedButton;
