import { TurtleConfirmModal } from '@components/element';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOK: () => void;
}

/**
 * 발주 삭제 모달
 * @param {boolean} visible 모달의 표시 유무
 * @param {() => void} onOK 모달의 내용을 실행할때 이벤트 함수
 * @param onCancel 모달을 닫을때 이벤트 함수
 */
function DeleteOrderModal({ visible, onOK, onCancel }: Props) {
  return (
    <TurtleConfirmModal
      visible={visible}
      title="정말 삭제할까요?"
      description={['삭제하면 이전으로 되돌릴 수 없어요.']}
      okText="삭제"
      onOk={onOK}
      onCancel={onCancel}
    ></TurtleConfirmModal>
  );
}

export default DeleteOrderModal;
