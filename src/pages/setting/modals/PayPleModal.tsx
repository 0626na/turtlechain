import paypleAPI from '@apis/paypleAPI';
import { PrimaryButton } from '@components/element';
import TurtleContentModal from '@components/element/modal/TurtleContentModal';

import useUser from '@hooks/useUser';
import { Form } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function PaypleModal({ visible, closeModal }: Props) {
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

  return (
    <TurtleContentModal
      visible={visible}
      onClose={() => {
        closeModal();
      }}
      title="멤버쉽 결제"
    >
      <Form colon={false}>
        <Form.Item label={<span css={{ fontSize: 20 }}>결제선택</span>}>
          <div css={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <PrimaryButton
              size="small"
              onClick={() => {
                authenticateMutation.mutate({
                  company_id: Number(user.company_id),
                  pay_type: 'regular',
                });
              }}
            >
              정기결제
            </PrimaryButton>

            <PrimaryButton
              size="small"
              onClick={() => {
                authenticateMutation.mutate({
                  company_id: Number(user.company_id),
                  pay_type: 'single',
                });
              }}
            >
              일반결제
            </PrimaryButton>
          </div>
        </Form.Item>
      </Form>
    </TurtleContentModal>
  );
}

export default PaypleModal;
