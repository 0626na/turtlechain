import { TurtleIcon } from '@components/element';
import AlertCloseIcon from '@components/element/icon/AlertCloseIcon';
import { css } from '@emotion/react';
import { message as antdMessage } from 'antd';

export const message = {
  // 기본으로 띄워져있는 시간 : 1초
  success: (content: string, duration = 2) => {
    antdMessage.info({
      content: (
        <div css={leftContent}>
          <TurtleIcon name="alertSuccess" />
          <span css={textMargin}>{content}</span>
        </div>
      ),
      icon: <AlertCloseIcon />,
      duration,
      key: 'msgKey',
      onClick: () => antdMessage.destroy('msgKey'),
    });
  },

  error: (content: string, duration = 2) => {
    antdMessage.error({
      content: (
        <div css={leftContent}>
          <TurtleIcon name="alertFail" />
          <span css={textMargin}>{content}</span>
        </div>
      ),
      icon: <AlertCloseIcon />,
      duration,
      key: 'msgKey',
      onClick: () => antdMessage.destroy('msgKey'),
    });
  },

  warn: (content: string, duration = 2) => {
    antdMessage.warn({
      content: (
        <div css={leftContent}>
          <TurtleIcon name="alertWarn" />
          <span css={textMargin}>{content}</span>
        </div>
      ),
      icon: <AlertCloseIcon />,
      duration,
      key: 'msgKey',
      onClick: () => antdMessage.destroy('msgKey'),
    });
  },
};

const leftContent = css({ display: 'flex' });
const textMargin = css({
  marginTop: 2,
  marginLeft: 8,
  marginRight: 10,
});
