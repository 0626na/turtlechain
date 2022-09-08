import React from 'react';
import { Col, Row } from 'antd';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';
import { css } from '@emotion/react';
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
          <div css={modalHeader}>
            <Row justify="space-between">
              <Col>
                <h1 css={$title}>{title}</h1>
              </Col>
              <Col>
                <ModalCloseIcon
                  style={{ cursor: 'pointer' }}
                  onClick={onClose}
                />
              </Col>
            </Row>
            <Row
              css={css`
                overflow: auto;
                padding-right: 16px;
              `}
            >
              {children}
            </Row>
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

const modalHeader = css`
  width: 600px;
  max-height: 80vh;

  position: relative;
  top: 50%;
  left: 50%;
  z-index: 1;

  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;

  padding: 32px;

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

// const Description = styled.p`
//   margin-top: 16px;

//   color: #5b5d63;
//   line-height: 1.429;
// `;

// const Footer = styled.div`
//   display: flex;
//   justify-content: end;
//   margin-top: 28px;
// `;

export default TurtleContentModal;
