import { CreateModal } from '@components/combine';
import { TurtleConfirmModal, TurtleText } from '@components/element';
import { FailListForOutput } from '@hooks/useOrderCart';
import { t } from 'i18next';

interface Props {
  visible: boolean;
  title: string;
  items: { title: string; content: string }[];
  description: string[];
  loading?: boolean;
  onCancel: () => void;
  onOk: () => void;
}
/**
 * 발주 실패목록에서 성공으로 변환시킬때 확인 모달
 */
function AddOrderFailtoSuccessModal({
  visible,
  title,
  description,
  onCancel,
  onOk,
  loading = false,
  items,
}: Props) {
  return (
    <CreateModal
      visible={visible}
      title={title}
      description={description}
      onClose={onCancel}
      onOk={onOk}
      items={items}
      loading={loading}
    />
  );
}

export default AddOrderFailtoSuccessModal;
