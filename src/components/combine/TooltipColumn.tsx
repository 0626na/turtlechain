import { TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import { Tooltip } from 'antd';

interface Props {
  title: string;
  children?: React.ReactNode;
}

function TooltipColumn({ title, children }: Props) {
  return (
    <Tooltip title={title} css={tooltip}>
      <span css={{ marginRight: 4, lineHeight: 1.1 }}>{children}</span>
      <TurtleIcon name="info" />
    </Tooltip>
  );
}

const tooltip = css({
  display: 'flex',
});

export default TooltipColumn;
