import { TurtleConfirmModal } from '@components/element';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOK: () => void;
}

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
