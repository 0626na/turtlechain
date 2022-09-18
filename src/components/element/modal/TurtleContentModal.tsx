import React from 'react';
import { css } from '@emotion/react';
import TurtleIcon from '../icon/TurtleIcon';

interface Props {
  visible: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'middle' | 'large';
}

function TurtleContentModal({
  visible = false,
  onClose,
  title,
  children,
  size = 'small',
}: Props) {
  let containerWidth = 0;
  if (size === 'large') containerWidth = 1200;
  if (size === 'middle') containerWidth = 884;
  if (size === 'small') containerWidth = 592;

  return (
    <>
      {visible && (
        <div css={modal.mask}>
          <div css={[modal.container, { width: containerWidth }]}>
            <div css={modal.header}>
              <h1 css={modal.headerTitle}>{title}</h1>
              <div>
                <TurtleIcon name="modalClose" onClick={onClose} />
              </div>
            </div>
            <div css={modal.content}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

const modal = {
  mask: css({
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    background: 'rgba(0, 0, 0, 0.45)',
  }),

  container: css({
    maxHeight: '90vh',
    height: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxShadow: '0px 8px 28px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  }),

  header: css({
    height: 24,
    margin: '32px 32px 40px 32px',
    display: 'flex',
    justifyContent: 'space-between',
  }),

  headerTitle: css({
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1,
    color: '#242934',
  }),

  content: css({
    padding: '0px 40px 12px 40px',
    overflowY: 'auto',
    marginBottom: 20,
  }),
};
export default TurtleContentModal;
