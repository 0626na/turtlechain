import InputModal from '@components/combine/modal/InputModal';
import { t } from 'i18next';
import React from 'react';

interface Props {
  visible: boolean;
  close: () => void;
  onOk(value: string): void;
  defaultValue: string;
}

function OrderMemoModal({ visible, close, onOk, defaultValue }: Props) {
  return (
    <InputModal
      defaultValue={defaultValue}
      visible={visible}
      onCancel={close}
      title={t('table.memo')}
      description={[
        t('description.input important memo'),
        t('description.make use of memo'),
      ]}
      onOk={onOk}
    />
  );
}

export default OrderMemoModal;
