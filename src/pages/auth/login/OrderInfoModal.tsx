import { TurtleContentModal } from '@components/combine';
import { AlertCloseIcon, TertiaryButton } from '@components/element';
import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import { Typography } from 'antd';
import { useCallback, useEffect } from 'react';

interface Props {
  visible: boolean;
  onClose(): void;
}

const MODAL_TOKEN = 'TC_MODAL_TOKEN';

function OrderInfoModal({ visible, onClose }: Props) {
  const setToken = () => {
    localStorage.setItem(MODAL_TOKEN, 'true');
  };

  // token이 있으면 모달 닫는다.
  useEffect(() => {
    const tokenValue = localStorage.getItem(MODAL_TOKEN) ?? '';
    if (!tokenValue) return;
    onClose();
  }, []);

  // 일주일간 안보기 클릭
  const onClickDisable = useCallback(() => {
    onClose();
    setToken();
  }, []);

  // 발주 이동 버튼 클릭
  const openOrderLink = useCallback(() => {
    window.open('https://order.turtlechain.io');
  }, []);

  return (
    <TurtleContentModal
      visible={visible}
      onClose={onClose}
      title={<div css={icon}>공지사항</div>}
    >
      <div css={title}>
        <span>발주 서비스 이용안내</span>
      </div>
      <div css={container}>
        서비스 개편을 위해 기존 발주 서비스 URL이 변경되었습니다.
        <br />
        발주 서비스를 이용중인 고객께서는 변경된 주소로 접속해 이용해주세요.
        <br />
        <br />
        <Typography.Link
          href="https://order.turtlechain.io"
          css={css({ color: `${theme.blue} !important` })}
        >
          변경된 주소 : https://order.turtlechain.io
        </Typography.Link>
      </div>

      <button css={button} onClick={openOrderLink}>
        발주 서비스 이동
      </button>
      <div css={notShowContainer}>
        <span css={notShowButton} onClick={onClickDisable}>
          다시 보지 않기
        </span>
        <AlertCloseIcon />
      </div>
    </TurtleContentModal>
  );
}

export default OrderInfoModal;

const container = css({ marginBottom: 40, lineHeight: 1.3 });

const notShowContainer = css({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 15,
});

const notShowButton = css({
  cursor: 'pointer',
  color: '#88898E',
  marginRight: 4,
});

const button = css({
  cursor: 'pointer',
  backgroundColor: 'F0F3F6',
  border: 'none',
  width: '100%',
  padding: 15,
  borderRadius: 8,
  color: theme.grey500,
  fontSize: 16,
  fontWeight: 700,
});

const icon = css({
  background: theme.blueGradient,
  borderRadius: 14,
  padding: '7px 12px',
  color: theme.white,
  fontWeight: 400,
  fontSize: 14,
});

const title = css({ fontSize: 24, fontWeight: 700, marginBottom: 16 });
