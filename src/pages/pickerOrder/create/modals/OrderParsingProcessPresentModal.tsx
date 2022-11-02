import { CreateModal, TurtleContentModal } from '@components/combine';
import { TurtleConfirmModal } from '@components/element';
import { css } from '@emotion/react';
import React from 'react';

interface Props {
  visible: boolean;
  title: string;
  successCount: number;
  failCount: number;
  description: string[];
  messages: string[];
  onCancel: () => void;
  onOk: () => void;
  size?: 'small' | 'middle' | 'large';
}

function OrderParsingProcessPresentModal({
  visible,
  title,
  description,
  onCancel,
  onOk,
  successCount,
  failCount,
  messages,
  size,
}: Props) {
  return (
    <TurtleConfirmModal
      visible={visible}
      title={title}
      description={description}
      onCancel={onCancel}
      onOk={onOk}
      size={size}
    >
      <div
        css={css({ display: 'flex', flexDirection: 'column', marginTop: 40 })}
      >
        <div css={css({ display: 'flex' })}>
          <span css={css({ marginRight: 16 })}>문제 없는 발주서</span>
          <span>{successCount}개</span>
        </div>
        <div css={css({ marginTop: 24 })}>
          <span css={css({ marginRight: 16 })}>문제 있는 발주서</span>
          <span>{failCount}개</span>
        </div>
        <div
          css={css({ display: 'flex', flexDirection: 'column', marginTop: 15 })}
        >
          {messages.map((message) => {
            return <span>{message}</span>;
          })}
        </div>
      </div>
    </TurtleConfirmModal>
  );
}

export default OrderParsingProcessPresentModal;
