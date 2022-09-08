import { css } from '@emotion/react';
import React from 'react';
import AnswerButton from '../button/AnswerButton';

interface Props {
  visible: boolean;
  title: string;
  description: string[];
  children?: React.ReactNode;

  cancelText?: string;
  okText?: string;
  okDisabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onOk: () => void;
}

function TurtleConfirmModal({
  visible = false,
  title,
  description,
  children,

  cancelText = '취소',
  okText = '확인',
  okDisabled = false,
  loading,
  onCancel,
  onOk,
}: Props) {
  return (
    <>
      {visible && (
        <div css={modalMask}>
          <div css={modalContent}>
            <h1 css={$title}>{title}</h1>
            <p css={$description}>
              {description.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  <br />
                </React.Fragment>
              ))}
            </p>
            {children}
            <div css={footer}>
              <AnswerButton type="NO" text={cancelText} onClick={onCancel} />
              <AnswerButton
                onClick={onOk}
                loading={loading}
                disabled={okDisabled}
                margin={'0px 0px 0px 8px'}
                type="YES"
                text={okText}
              />
            </div>
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
  z-index: 10000;
  background: rgba(0, 0, 0, 0.45);
`;

const modalContent = css`
  width: 400px;

  color: #5b5d63;

  position: relative;
  top: 50%;
  left: 50%;
  z-index: 1;

  transform: translate(-50%, -75%);

  display: flex;
  flex-direction: column;

  padding: 24px;

  background: #ffffff;
  box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
`;

const $title = css`
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
  color: #242934;
`;

const $description = css`
  margin-top: 16px;

  line-height: 1.429;
  color: #5b5d63;
`;

const footer = css`
  display: flex;
  justify-content: end;
  margin-top: 28px;
`;

export default TurtleConfirmModal;
