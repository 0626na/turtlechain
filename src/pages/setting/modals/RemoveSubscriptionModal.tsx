import paypleAPI from '@apis/paypleAPI';
import { TurtleConfirmModal } from '@components/element';
import { message } from '@utils/message';
import { t } from 'i18next';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
  const queryClient = useQueryClient();
  const removeSubscriptionMutation = useMutation(paypleAPI.removeSubscription, {
    onSuccess: () => {
      queryClient.refetchQueries(['getSubscriptionCheckInUserTabQuery'], {
        active: true,
      });
      navigate('/setting?tab=user');
      message.success(t('message.success cancel subscription'));
      onClose();
    },
  });
  return (
    <TurtleConfirmModal
      size="small"
      description={[
        t(
          'regular payment termination will be applied from the pay date of next month',
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
      loading={removeSubscriptionMutation.isLoading}
      okText={t('subscription cancel')}
      title={t('do you really want me to unsubscribe')}
    />
  );
}

export default RemoveSubscriptionModal;
