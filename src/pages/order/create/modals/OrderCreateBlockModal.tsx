import React from 'react';
import { t } from 'i18next';
import { TurtleConfirmModal } from '@components/element';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}
/**
 * 쇼핑몰 발주에서 발주 횟수가 2회 초과할때 보여주는 모달
 */
function OrderCreateBlockModal({ visible, onOk, onCancel }: Props) {
  return (
    <TurtleConfirmModal
      title={t('title.you can only order up to the second round')}
      description={[
        t(
          'description.shopping malls that have completed the second order cannot send additional orders',
        ),
      ]}
      onCancel={onCancel}
      onOk={onOk}
      visible={visible}
    />
  );
}

export default OrderCreateBlockModal;
