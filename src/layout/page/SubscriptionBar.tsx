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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from '@utils/message';
import { t } from 'i18next';
import userAPI from '@apis/userAPI';

function SubscriptionBar() {
  const [modalVisible, modalOepn, modalClose] = useModal();
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const closeAlertBar = () => {
    setVisible(false);
  };

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
        callbackFunction: (res: any) => {
          // 성공일때 redirect
          if (res.PCD_PAY_RST === 'success') {
            setTimeout(() => {
              queryClient.refetchQueries(['getSubscriptionCheckQuery'], {
                active: true,
              });
            }, 2000);

            navigate('/clearing/create');
            message.success(
              t(
                'description.your subscription is complete. you can use the payment',
              ),
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
