import { TurtleConfirmModal } from '@components/element';
import React from 'react';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

function CancelpaymentModal({ visible, onCancel, onOk }: Props) {
  return (
    <TurtleConfirmModal
      title="정말 구독을 해지할까요?"
      description={[
        '정기결제 해지는 다음 달 1일부터 적용됩니다.',
        '해지 시 서비스 사용에 일부 제한될 수 있습니다.',
      ]}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    ></TurtleConfirmModal>
  );
}

export default CancelpaymentModal;
