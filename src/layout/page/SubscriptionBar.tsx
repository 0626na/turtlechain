import React, { useEffect } from 'react';
import CreateNewVendorModal from '@components/combine/modal/CreateNewVendorModal';
import { AlertCloseIcon, SelectButton, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { theme } from '@styles/theme';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@hooks/useUser';
import paypleAPI from '@apis/paypleAPI';
import { useMutation } from 'react-query';
import { message } from '@utils/message';
import { t } from 'i18next';

function SubscriptionBar() {
  const [modalVisible, modalOepn, modalClose] = useModal();
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const closeAlertBar = () => {
    setVisible(false);
  };

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

        PCD_RST_URL: `/clearing/create`,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callbackFunction: (res: any) => {
          // 성공, 실패 상관없이 결과 msg alert
          if (res.PCD_PAY_MSG === t('quit a payment')) return; // 취소 alert 안띄우기
          alert(res.PCD_PAY_MSG);

          // 성공일때 redirect
          if (res.PCD_PAY_RST === 'success') {
            navigate('/clearing/create');
            message.success(
              t('your subscription is complete. you can use the payment'),
              3,
            );
            modalClose();
          }
        },
      };

      // payple 내장 함수 호출 (결제 요청)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).PaypleCpayAuthCheck(requestData);
    },
  });

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

  return (
    <>
      {visible && (
        <div css={alertBarCss.self}>
          <TurtleIcon name="exclamationMark" />
          <span css={alertBarCss.text}>
            결제요청을 보내려면 서비스 구독이 필요합니다.
          </span>

          <SelectButton
            onClick={() => {
              if (!user?.company_id) return;
              authenticateMutation.mutate({
                company_id: user.company_id,
                request_type: 'PAY',
              });
            }}
            icon={<TurtleIcon name="alertBarArrowRight" />}
          >
            첫달 이용 100원
          </SelectButton>

          <div
            css={alertBarCss.closeIcon}
            onClick={() => {
              closeAlertBar();
            }}
          >
            <AlertCloseIcon value={theme.white} />
          </div>
        </div>
      )}
    </>
  );
}

const alertBarCss = {
  self: css({
    height: 48,
    color: theme.white,
    fontSize: 15,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: theme.bluegreen,
  }),

  text: css({
    marginLeft: 4,
    marginRight: 8,
  }),

  closeIcon: css({
    position: 'absolute',
    right: 18,
  }),
};

export default SubscriptionBar;
