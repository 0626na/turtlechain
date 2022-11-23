import paypleAPI from '@apis/paypleAPI';
import { TertiaryButton, TurtleIcon } from '@components/element';

import { css } from '@emotion/react';

import useUser from '@hooks/useUser';
import { theme } from '@styles/theme';
import { Form } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

/**
 * 결제 모달창(payple)
 *
 * https://developer.payple.kr/integration/recurring-payment
 */
function PayMentModal({ visible, closeModal }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();

  // payple, jquery script 태그 동적 불러온다.
  useEffect(() => {
    const script = document.createElement('script');

    script.src =
      process.env.REACT_APP_SERVICE_TYPE === 'production'
        ? 'https://cpay.payple.kr/js/cpay.payple.1.0.1.js' // 상용 payple script (prod)
        : 'https://democpay.payple.kr/js/cpay.payple.1.0.1.js'; // 테스트 payple script (alpha)
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const authenticateMutation = useMutation(paypleAPI.authenticate, {
    onSuccess: (data) => {
      const requestData = {
        PCD_PAY_TYPE: data.PCD_PAY_TYPE,
        PCD_PAY_WORK: data.PCD_PAY_WORK,
        PCD_CARD_VER: '01',
        PCD_PAYER_NO: data.PCD_PAYER_NO,
        PCD_PAYER_NAME: data.PCD_PAYER_NAME,

        PCD_PAY_GOODS: data.PCD_PAY_GOODS,
        PCD_PAY_TOTAL: data.PCD_PAY_TOTAL,
        PCD_PAY_ISTAX: data.PCD_PAY_ISTAX,

        PCD_PAY_URL: data.return_url,
        PCD_AUTH_KEY: data.AuthKey,

        PCD_RST_URL: `/setting/user`,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callbackFunction: (res: any) => {
          // 성공, 실패 상관없이 결과 msg alert
          if (res.PCD_PAY_MSG === '결제를 종료하였습니다.') return; // 취소 alert 안띄우기
          alert(res.PCD_PAY_MSG);

          // 성공일때 redirect
          if (res.PCD_PAY_RST === 'success') {
            navigate('/setting/user');
            closeModal();
          }
        },
      };

      // payple 내장 함수 호출 (결제 요청)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).PaypleCpayAuthCheck(requestData);
    },
  });

  useEffect(() => {
    const escKeyModalClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', escKeyModalClose);
    return () => window.removeEventListener('keydown', escKeyModalClose);
  }, []);

  return (
    <div
      css={modal.mask}
      style={{ display: visible ? 'block' : 'none' }}
      onClick={() => {
        closeModal();
      }}
    >
      <div
        css={[modal.container]}
        onClick={(e) => {
          e.stopPropagation(); // TODO: 추후 마스크를 분리하여 리택토링 예정
        }}
      >
        <div css={modal.header}>
          <h1 css={modal.headerTitle}>유료플랜 구독</h1>
          <div>
            <TurtleIcon
              name="modalClose"
              onClick={() => {
                closeModal();
              }}
            />
          </div>
        </div>

        <div css={modal.description}>
          <p>해당 기능은 유료플랜으로만 제공됩니다.</p>
          <p>유료플랜을 구독하고 서비스를 이용해주세요</p>
        </div>

        <div css={modal.buttonContainer}>
          <TertiaryButton
            text="테스트 알림톡 받아보기"
            size="large"
            onClick={() => {}}
          />

          <TertiaryButton
            text="구독하기"
            size="large"
            onClick={() => {
              authenticateMutation.mutate({
                company_id: Number(user?.company_id),
                pay_type: 'single',
              });
            }}
          />
        </div>
      </div>
    </div>
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
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.45)',
  }),

  container: css({
    width: 480,
    height: 308,
    maxHeight: '92vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxShadow: '0px 8px 28px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: '32px 32px 48px 32px',
  }),

  header: css({
    height: 24,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
  }),

  headerTitle: css({
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1,
    color: '#242934',
  }),

  description: css({
    marginBottom: 40,
    color: theme.grey600,
    lineHeight: 1.4,
  }),
  buttonContainer: css({ display: 'flex', flexDirection: 'column', gap: 12 }),
};
export default PayMentModal;
