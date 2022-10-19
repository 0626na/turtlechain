import { TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import { Tooltip } from 'antd';
import React from 'react';

interface Props {
  title: string[];
  children?: React.ReactNode;
}

function TooltipColumn({ title, children }: Props) {
  return (
    <Tooltip
      title={
        <React.Fragment>
          {title.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              <br />
            </React.Fragment>
          ))}
        </React.Fragment>
      }
      css={tooltip}
    >
      <span css={{ marginRight: 4, lineHeight: 1.1 }}>{children}</span>
      <TurtleIcon name="info" />
    </Tooltip>
  );
}

const tooltip = css({
  display: 'flex',
});

export default TooltipColumn;
