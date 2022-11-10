import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import AnswerButton from '../button/AnswerButton';

interface Props {
  visible: boolean;
  title: string;
  description: string[];
  onCancel: () => void;
  onOk: () => void;

  children?: React.ReactNode;
  cancelText?: string;
  okText?: string;
  okDisabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'middle' | 'large';
}

function TurtleConfirmModal({
  visible = false,
  title,
  description,
  children,

  cancelText = '취소',
  okText = '확인',
  okDisabled = false,
  size = 'small',
  loading,
  onCancel,
  onOk,
}: Props) {
  
  useEffect(() => {
    const escKeyModalClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', escKeyModalClose);
    return () => window.removeEventListener('keydown', escKeyModalClose);
  }, []);

  return (
    <>
      {visible && (
        <div
          css={modalMask}
          onClick={() => {
            onCancel();
          }}
        >
          <div
            css={[modalContent, sizeCss[size]]}
            onClick={(e) => {
              e.stopPropagation(); // TODO: 추후 마스크를 분리하여 리택토링 예정
            }}
          >
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
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 5;
  background: rgba(0, 0, 0, 0.45);
`;

const sizeCss = {
  small: { width: 400 },
  middle: { width: 884 },
  large: { width: '91.8vw' },
};

const modalContent = css`
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
  font-size: 14px;
  line-height: 1.429;
  color: #5b5d63;
`;

const footer = css`
  display: flex;
  justify-content: end;
  margin-top: 28px;
`;

export default TurtleConfirmModal;
