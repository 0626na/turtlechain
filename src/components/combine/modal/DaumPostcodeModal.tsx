import DaumPostcode, { Address } from 'react-daum-postcode';
// antd
import { Modal, Button } from 'antd';
// lang
import { t } from 'i18next';

interface Props {
  visible: boolean;
  onClose: () => void; // 모달창 닫기
  onGetAddress?: (address: string) => void; // 주소 값 얻기 콜백
}

function DaumPostcodeModal({ visible, onClose, onGetAddress }: Props) {
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onGetAddress && onGetAddress(fullAddress);
    onClose();
  };

  return (
    <Modal
      closable={false}
      visible={visible}
      destroyOnClose={true}
      title={t('find address')}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('close')}
        </Button>,
      ]}
    >
      <DaumPostcode onComplete={handleComplete} />
    </Modal>
  );
}

export default DaumPostcodeModal;
