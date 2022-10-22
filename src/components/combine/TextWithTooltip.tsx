import { css } from '@emotion/react';
import { Tooltip } from 'antd';
import React from 'react';
import { ReactComponent as InfoIcon } from '@icons/info.svg';

interface Props {
  tooltipContent: string[];
  children?: React.ReactNode;
  iconPlacement?: 'left' | 'right';
}

function TextWithTooltip({
  tooltipContent,
  children,
  iconPlacement = 'right',
}: Props) {
  return (
    <div css={tooltip}>
      {iconPlacement === 'left' && (
        <Tooltip
          title={
            <React.Fragment>
              {tooltipContent.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  <br />
                </React.Fragment>
              ))}
            </React.Fragment>
          }
        >
          <InfoIcon css={{ marginRight: 4 }} />
        </Tooltip>
      )}

      <span css={text}>{children}</span>

      {iconPlacement === 'right' && (
        <Tooltip
          title={
            <React.Fragment>
              {tooltipContent.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  <br />
                </React.Fragment>
              ))}
            </React.Fragment>
          }
        >
          <InfoIcon css={{ marginLeft: 4 }} />
        </Tooltip>
      )}
    </div>
  );
}

const tooltip = css({
  display: 'flex',
});
const text = css({ lineHeight: 1 });

export default TextWithTooltip;
