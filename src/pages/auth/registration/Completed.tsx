import { t } from 'i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { css } from '@emotion/react';
import { TertiaryButton } from '@components/element';
import { useEffect } from 'react';
import React from 'react';

interface Props {
  visible: boolean;
  // title?: string;
  // description?: string;
  // children?: React.ReactNode;
}
function Completed({ visible }: Props) {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const onClickGoHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (visible) setSearchParams({ step: 'completed' });
  }, [setSearchParams, visible]);

  return (
    <>
      {visible && (
        <div css={Container}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/approve.png`}
            alt="approve"
          />
          <span css={title}>{t('message.success registration')}</span>
          <span css={description}>
            감사합니다. 입력해주신 메일 주소로 영업일 기준 1-2일 내에
            <br /> 신청 결과에 대한 안내메일이 발송됩니다. 가입승인 후 서비스를
            이용해주세요.
          </span>

          <TertiaryButton text={t('go home')} onClick={onClickGoHome} />
        </div>
      )}
    </>
  );
}

const Container = css({
  width: 460,
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%,-50%)',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const title = css({
  marginTop: 32,
  color: '#242934',
  fontWeight: 700,
  fontSize: 26,
});

const description = css({
  marginTop: 16,
  marginBottom: 60,
  lineHeight: 1.8,
  fontWeight: 400,
  fontSize: 14,
  textAlign: 'center',
  color: '#5b5d63',
});

export default Completed;
