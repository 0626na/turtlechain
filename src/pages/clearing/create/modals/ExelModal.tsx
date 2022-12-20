import React, { useState } from 'react';

import { Tabs } from 'antd';
import { useMutation, useQuery } from 'react-query';
import clearingAPI from '@apis/clearingAPI';
import { t } from 'i18next';
import { PrimaryButton, TurtleIcon, TurtleTabs } from '@components/element';
import { useNavigate } from 'react-router-dom';
import { CreateModal, TurtleContentModal } from '@components/combine';
import useExelClearingCart from '@hooks/useExelClearingCart';
import SuccessTab from '../tabs/SuccessTab';
import FailTab from '../tabs/FailTab';
import useStore from '@hooks/useStore';

import { useModal, useUser } from '@hooks/index';
import { theme } from '@styles/theme';
import { css } from '@emotion/react';
import { message } from '@utils/message';
import userAPI from '@apis/userAPI';
import PayMentModal from './PayMentModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function ExelModal({ visible, onClose }: Props) {
  const navigate = useNavigate();
  const { cart } = useExelClearingCart();
  const { store } = useStore();
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [createModalVisible, createModalOpen, createModalClose] = useModal();
  const [paymentModalVisible, paymentModalOpen, paymentModalClose] = useModal();

  /**
   * 유저의 구독여부 찾기
   */
  const getSubscriptionCheckQuery = useQuery(
    'getSubscriptionCheckQuery',
    () =>
      userAPI.getSubscriptionCheck({ company_id: Number(user?.company_id) }),
    {
      onSuccess: (data) => {
        setIsSubscribed(data.data.is_expired);
      },
    },
  );

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

  return (
    <>
      <PayMentModal
        visible={paymentModalVisible}
        closeModal={paymentModalClose}
      />
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
        title={t('title.really register')}
        description={[
          t('description.cannot reset after register'),
          t('description.confirm payment info'),
        ]}
        items={[
          { title: t('table.payment date'), content: cart.clearingRequestDate },
          {
            title: t('table.unpaidAmount'),
            content: `${amount.toLocaleString()}${t('description.won')}`,
          },
          {
            title: t('table.totalVendorCount'),
            content: t('count', { count: successCount }),
          },
        ]}
      />

      <TurtleContentModal
        visible={visible}
        onClose={onClose}
        title={t('title.upload clearing sheet')}
        size="large"
      >
        <TurtleTabs>
          <Tabs.TabPane tab={`${t('success')}(${successCount})`} key="success">
            <SuccessTab />
          </Tabs.TabPane>

          <Tabs.TabPane tab={`${t('fail')}(${failCount})`} key="fail">
            <FailTab />
          </Tabs.TabPane>
        </TurtleTabs>

        <footer css={footerCss.self}>
          <div css={footerCss.leftContentCss.self}>
            <span css={footerCss.leftContentCss.smallText}>
              {t('table.total today payment')}
            </span>

            <span css={footerCss.leftContentCss.middleText}>
              {amount.toLocaleString()}
              {t('description.won')}
            </span>
          </div>

          <PrimaryButton
            disabled={amount === 0}
            onClick={() => {
              isSubscribed ? createModalOpen() : paymentModalOpen();
            }}
            icon={<TurtleIcon name="rightTriangle" />}
          >
            {t('button.send payment')}
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
