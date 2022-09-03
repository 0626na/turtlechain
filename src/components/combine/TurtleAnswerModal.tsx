import React from 'react';

import styled from '@emotion/styled';

import AnswerButton from '../element/Buttons/AnswerButton';
interface Props {
  visible: boolean;
  title: string;
  description: React.ReactNode; // 줄바꿈이 필요할땐 사용하는 컴포넌트내에서 br태그를 사용할것.
  children?: React.ReactNode;

  cancelText?: string;
  okText?: string;
  okDisabled?: boolean;
  onCancel: () => void;
  onOk: () => void;
}

function TurtleAnswerModal({
  visible = false,
  title,
  description,
  children,

  cancelText = '취소',
  okText = '결제내역 바로가기',
  okDisabled = false,
  onCancel = () => {},
  onOk = () => {},
}: Props) {
  return (
    <>
      {visible && (
        <ModalMask>
          <ModalContent>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {children}
            <Footer>
              <AnswerButton type="NO" text={cancelText} onClick={onCancel} />
              <AnswerButton
                onClick={onOk}
                disabled={okDisabled}
                margin={'0px 0px 0px 8px'}
                type="YES"
                text={okText}
              />
            </Footer>
          </ModalContent>
        </ModalMask>
      )}
    </>
  );
}

const ModalMask = styled.div`
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.45);
`;

const ModalContent = styled.div`
  width: 400px;

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

const Title = styled.h1`
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
  color: #242934;
`;

const Description = styled.p`
  margin-top: 16px;

  color: #5b5d63;
  line-height: 1.429;
`;

const Footer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 28px;
`;

export default TurtleAnswerModal;
