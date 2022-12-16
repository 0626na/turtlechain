import { TurtleConfirmModal } from '@components/element';
import { css } from '@emotion/react';

import React from 'react';

interface Props {
  visible: boolean;
  title: string;
  description: string[];
  onClose: () => void;
  onOk: () => void;
  loading: boolean;
  okText?: string;
  items: { title: string; content: string }[];
}

function CreateModal({
  onClose,
  onOk,
  items,
  okText = '요청',
  ...props
}: Props) {
  return (
    <div>
      <TurtleConfirmModal
        onOk={onOk}
        onCancel={onClose}
        okText={okText}
        {...props}
      >
        <div css={contentCss.self}>
          {items.map((item, idx) => (
            <div key={idx}>
              <span
                css={{
                  color: '#434852',
                  display: 'inline-block',
                  minWidth: 80,
                  marginRight: 16,
                }}
              >
                {item.title}
              </span>
              <span
                css={{
                  color: '#242934',
                }}
              >
                {item.content}
              </span>
            </div>
          ))}
        </div>
      </TurtleConfirmModal>
    </div>
  );
}

const contentCss = {
  self: css({
    lineHeight: 1,
    marginTop: 40,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    zIndex: 1,
    position: 'relative',
  }),
};

export default CreateModal;
