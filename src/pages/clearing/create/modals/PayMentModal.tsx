import React, { useState } from 'react';
import paypleAPI from '@apis/paypleAPI';
import { TertiaryButton, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import useUser from '@hooks/useUser';
import { theme } from '@styles/theme';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { message } from '@utils/message';
import useClearingCart from '@hooks/useClearingCart';
import userAPI from '@apis/userAPI';
import { type } from 'os';

interface Props {
  visible: boolean;
  closeModal: () => void;
  isPicker: boolean;
}

/* 구독 결제 모달창(payple)
 *
 * https://developer.payple.kr/integration/recurring-payment
 */
function PayMentModal({ visible, closeModal, isPicker = false }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { cart, clearingPaymentTotal } = useClearingCart();

  const getSubscriptionCheckQuery = useQuery(
    'getSubscriptionCheckInPaymentModalQuery',
    () =>
      userAPI.getSubscriptionCheck({
        company_id: user?.company_id ?? 0,
      }),
    {
      enabled: visible,
      refetchInterval: (data) => {
        if (data?.data.is_expired) {
          setButtonLoading(false);
          closeModal();
          navigate('/clearing/create');
          queryClient.refetchQueries('getSubscriptionCheckQuery');
          return false;
        }
        return 3000;
      },
    },
  );

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
        PCD_PAY_TYPE: data.data.PCD_PAY_TYPE,
        PCD_PAY_WORK: data.data.PCD_PAY_WORK,
        PCD_CARD_VER: '01',
        PCD_PAYER_NO: data.data.PCD_PAYER_NO,
        PCD_PAYER_NAME: data.data.PCD_PAYER_NAME,

        PCD_PAY_GOODS: data.data.PCD_PAY_GOODS,
        PCD_PAY_TOTAL: data.data.PCD_PAY_TOTAL,
        PCD_PAY_ISTAX: data.data.PCD_PAY_ISTAX,

        PCD_PAY_URL: data.data.return_url,
        PCD_AUTH_KEY: data.data.AuthKey,

        PCD_RST_URL: `/clearing/create`,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callbackFunction: (res: any) => {},
      };

      // payple 내장 함수 호출 (결제 요청)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).PaypleCpayAuthCheck(requestData);
    },
  });

  const testAlimtalkMutation = useMutation(paypleAPI.updateTestalimTalk, {
    onSuccess: () => {
      message.success(t('message.success send test alimtalk'));
      closeModal();
    },
  });

  useEffect(() => {
    const escKeyModalClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !buttonLoading) closeModal();
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
          <h1 css={modal.headerTitle}>{t('title.subscription paid plan')}</h1>
          <div>
            <TurtleIcon
              name="modalClose"
              onClick={() => {
                !buttonLoading && closeModal();
              }}
            />
          </div>
        </div>

        <div css={modal.description}>
          <p>
            {t('description.payment feature is only available as a paid plan')}
          </p>
          <p>
            {t(
              'description.if you subscribe to the service, you can pay for all the client products at once',
            )}
          </p>
        </div>

        <div css={modal.buttonContainer}>
          <TertiaryButton
            loading={buttonLoading}
            text={t('button.subscription')}
            size="large"
            onClick={() => {
              authenticateMutation.mutate({
                company_id: Number(user?.company_id),
                request_type: 'PAY',
                user_id: isPicker ? user?.id : 0,
              });
              setButtonLoading(true);
            }}
          />
          <TertiaryButton
            loading={buttonLoading}
            text={t('button.testNotificationKakaoTalk')}
            size="large"
            onClick={() => {
              testAlimtalkMutation.mutate({
                request_date: cart.clearingRequestDate,
                clearing_amount:
                  Math.round((clearingPaymentTotal * 1.1) / 10) * 10,
                type: isPicker ? 'order' : 'clearing',
                user_id: isPicker ? user?.id : undefined,
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
    zIndex: 10,
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
