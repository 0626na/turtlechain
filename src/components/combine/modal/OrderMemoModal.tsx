import InputModal from '@components/combine/modal/InputModal';
import { t } from 'i18next';
import React from 'react';

interface Props {
  visible: boolean;
  close: () => void;
  onOk(value: string): void;
  defaultValue: string;
}

/**
 * 발주 메모 모달
 * @param visible 모달 표시 유무 boolean
 * @param close 모달 닫을때 이벤트 함수
 * @param onOk 모달의 내용 실행할때 이벤트 함수
 * @param defaultValue 메모가 이미 존재할 경우에 defaultValue로 표시
 */
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
