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
      description={[t('description.memoInput1'), t('description.memoInput2')]}
      onOk={onOk}
    />
  );
}

export default OrderMemoModal;
