import paypleAPI from '@apis/paypleAPI';
import { TurtleConfirmModal } from '@components/element';
import { message } from '@utils/message';
import { t } from 'i18next';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  onClose: () => void;
  id: number;
}

/**
 * 구독해지 modal
 * @param id 해지하려는 쇼핑몰 사업자 id
 *
 */
function RemoveSubscriptionModal({ visible, onClose, id }: Props) {
  const navigate = useNavigate();
  const removeSubscriptionMutation = useMutation(paypleAPI.removeSubscription, {
    onSuccess: () => {
      message.success('구독해지가 완료되었습니다.');
      navigate('/setting?tab=user');
      onClose();
    },
  });
  return (
    <TurtleConfirmModal
      size="small"
      description={[
        t(
          'regular payment termination will be applied from the 1st of next month',
        ),
        t('termination may restrict some use of the service'),
      ]}
      visible={visible}
      onCancel={onClose}
      onOk={() => {
        removeSubscriptionMutation.mutate({
          compay_id: id,
          request_type: 'cancel_subscription',
        });
      }}
      okText={t('subscription cancel')}
      title={t('do you really want me to unsubscribe')}
    />
  );
}

export default RemoveSubscriptionModal;
