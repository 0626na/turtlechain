import { TurtleConfirmModal, TurtleText } from '@components/element';
import { FailListForOutput } from '@hooks/useOrderCart';

interface Props {
  visible: boolean;
  title: string;
  failData: { record: FailListForOutput; mobile: string };
  description: string[];
  onCancel: () => void;
  onOk: () => void;
}
function AddOrderFailtoSuccessModal({
  visible,
  title,
  description,
  onCancel,
  onOk,
  failData,
}: Props) {
  return (
    <TurtleConfirmModal
      visible={visible}
      title={title}
      description={description}
      onCancel={onCancel}
      onOk={onOk}
    >
      <div>
        <br />
        <TurtleText>{`쇼핑몰: ${failData.record.rt_store_name}`}</TurtleText>{' '}
        <br />
        <TurtleText>{`거래처: ${failData.record.vendor_name}`}</TurtleText>{' '}
        <br />
        <TurtleText>{`주소: ${failData.record.vendor_address}`}</TurtleText>{' '}
        <br />
        <TurtleText>{`휴대전화번호: ${failData.mobile}`}</TurtleText> <br />
      </div>
    </TurtleConfirmModal>
  );
}

export default AddOrderFailtoSuccessModal;
