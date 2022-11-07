import React from 'react';

import { Tabs } from 'antd';
import { useMutation } from 'react-query';
import clearingAPI from '@apis/clearingAPI';
import { t } from 'i18next';
import { PrimaryButton, TurtleIcon, TurtleTabs } from '@components/element';
import { useNavigate } from 'react-router-dom';
import { CreateModal, TurtleContentModal } from '@components/combine';
import useExelClearingCart from '@hooks/useExelClearingCart';
import SuccessTab from '../tabs/SuccessTab';
import FailTab from '../tabs/FailTab';
import useStore from '@hooks/useStore';

import { useModal } from '@hooks/index';
import { theme } from '@styles/theme';
import { css } from '@emotion/react';
import { message } from '@utils/message';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function ExelModal({ visible, onClose }: Props) {
  const navigate = useNavigate();
  const { cart } = useExelClearingCart();
  const { store } = useStore();
  const [createModalVisible, createModalOpen, createModalClose] = useModal();

  const createMutation = useMutation(clearingAPI.createParse, {
    onSuccess: () => {
      message.success(t('message.success create clearing'));
      onClose();
      navigate('/clearing/history');
    },
  });

  const clickCreate = () => {
    createMutation.mutate({
      store_id: Number(store.selected?.id),
      store_name: String(store.selected?.name),
      credit_type: 'general',
      request_date: cart.clearingRequestDate,
      total_clearing_amount:
        cart.successList.reduce((acc, cur) => acc + cur.credit_amount, 0) ?? 0,
      clearing_add_request: cart.successList.map((item) => ({
        ...item,
      })),
    });
  };

  const successCount = cart.successList.length;
  const failCount = cart.failList.length;
  const amount = cart.successList.reduce(
    (acc, cur) => acc + cur.credit_amount,
    0,
  );
  const vat = (Math.round((amount * 1.1) / 10) * 10 - amount).toLocaleString();
  const vatIncludedAmount = (
    Math.round((amount * 1.1) / 10) * 10
  ).toLocaleString();

  return (
    <>
      {/*
       * 결제요청 모달
       */}
      <CreateModal
        onOk={() => {
          clickCreate();
        }}
        loading={createMutation.isLoading}
        visible={createModalVisible}
        onClose={createModalClose}
        title="정말 요청을 보낼까요?"
        description={[
          '등록 후에는 이전으로 되돌릴 수 없어요.',
          '결제 정보를 다시한번 확인해주세요.',
        ]}
        items={[
          { title: '결제요청 일자', content: cart.clearingRequestDate },
          {
            title: '결제요청 금액',
            content: `${vatIncludedAmount}원(부가세${vat}원 포함)`,
          },
          { title: '총 거래처수', content: `${successCount}개` },
        ]}
      />

      <TurtleContentModal
        visible={visible}
        onClose={onClose}
        title="정산서 업로드"
        size="large"
      >
        <TurtleTabs>
          <Tabs.TabPane tab={`성공(${successCount})`} key="success">
            <SuccessTab />
          </Tabs.TabPane>

          <Tabs.TabPane tab={`실패(${failCount})`} key="fail">
            <FailTab />
          </Tabs.TabPane>
        </TurtleTabs>

        <footer css={footerCss.self}>
          <div css={footerCss.leftContentCss.self}>
            <span css={footerCss.leftContentCss.smallText}>
              총 당일 결제 합계
            </span>

            <span css={footerCss.leftContentCss.middleText}>
              <span css={footerCss.leftContentCss.larginText}>
                (부가세 {vat}원 포함){' '}
              </span>
              {vatIncludedAmount}원
            </span>
          </div>

          <PrimaryButton
            disabled={amount === 0}
            onClick={() => {
              createModalOpen();
            }}
            icon={<TurtleIcon name="rightTriangle" />}
          >
            결제요청 보내기
          </PrimaryButton>
        </footer>
      </TurtleContentModal>
    </>
  );
}

const footerCss = {
  self: css({
    position: 'absolute',
    bottom: 32,
    right: 40,
    display: 'flex',
    alignItems: 'center',
  }),

  leftContentCss: {
    self: css({
      height: 40,
      marginRight: 24,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'end',
    }),
    smallText: css({ color: theme.grey500, fontSize: 13 }),
    middleText: css({ fontWeight: 700, fontSize: 20 }),
    larginText: css({ fontWeight: 500, fontSize: 16 }),
  },
};

export default ExelModal;
