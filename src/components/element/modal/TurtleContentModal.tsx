import React from 'react';

import { css } from '@emotion/react';
import TurtleIcon from '@components/element/TurtleIcon';
interface Props {
  visible: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function TurtleContentModal({
  visible = false,
  onClose,
  title,
  children,
}: Props) {
  return (
    <>
      {visible && (
        <div css={modalMask}>
          <div css={modalContainer}>
            <div css={modalHeader}>
              <h1 css={$title}>{title}</h1>
              <div>
                <TurtleIcon name="modalClose" onClick={onClose} />
              </div>
            </div>
            <div css={modalContent}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

const modalMask = css`
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.45);
`;

const modalContainer = css`
  width: 600px;
  max-height: 90vh;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;

  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;

  background: #fff;
  box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
`;

const modalHeader = css`
  height: 24px;
  margin: 32px 32px 40px 32px;

  display: flex;
  justify-content: space-between;
`;

const modalContent = css`
  padding: 0px 32px 40px 32px;
  overflow-y: auto;
`;

const $title = css`
  font-weight: 700;
  font-size: 24px;

  color: #242934;
`;

export default TurtleContentModal;
