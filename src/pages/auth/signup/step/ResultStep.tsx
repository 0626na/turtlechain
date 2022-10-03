import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { css } from '@emotion/react';
import { TertiaryButton } from '@components/element';

interface Props {
  visible: boolean;
}

function ResultStep({ visible }: Props) {
  const navigate = useNavigate();

  const onClickGoHome = () => {
    navigate('/');
  };

  return (
    <div
      css={{
        display: visible ? '' : 'none',
      }}
    >
      <div css={Container}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/approve.png`}
          alt="approve"
        />
        <span css={title}>{t('message.success signup')}</span>
        <span css={description}>
          감사합니다. 가입승인 후 서비스를 이용하실 수 있습니다.
          <br /> 신청시 입력한 메일주소로 가입승인 여부에 대한 안내메일이
          발송됩니다.
        </span>

        <TertiaryButton text={t('go home')} onClick={onClickGoHome} />
      </div>
    </div>
  );
}

const Container = css({
  width: 420,
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

  fontWeight: 400,
  fontSize: 14,
  textAlign: 'center',
  color: '#5b5d63',
});

export default ResultStep;
