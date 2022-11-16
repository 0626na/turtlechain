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
        <TurtleText>{`${t('table.store')}: ${
          failData.record.rt_store_name
        }`}</TurtleText>{' '}
        <br />
        <TurtleText>{`${t('table.vendor')}: ${
          failData.record.vendor_name
        }`}</TurtleText>{' '}
        <br />
        <TurtleText>{`${t('table.address')}: ${
          failData.record.vendor_address
        }`}</TurtleText>{' '}
        <br />
        <TurtleText>{`${t('table.mobile')}: ${failData.mobile}`}</TurtleText>{' '}
        <br />
      </div>
    </TurtleConfirmModal>
  );
}

export default AddOrderFailtoSuccessModal;
