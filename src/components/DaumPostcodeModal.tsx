import DaumPostcode, { Address } from "react-daum-postcode";
import { Modal, Button } from "antd";
import { CLOSE, FIND_POSTCODE } from "constant/string";

interface Props {
  visible: boolean;
  onClose: () => void; // 모달창 닫기
  onGetAddress?: (address: string) => void; // 주소 값 얻기 콜백
}

const DaumPostcodeModal = function ({ visible, onClose, onGetAddress }: Props) {
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onGetAddress && onGetAddress(fullAddress);
    onClose();
  };

  return (
    <Modal
      closable={false}
      visible={visible}
      destroyOnClose={true}
      title={FIND_POSTCODE}
      footer={[
        <Button key="close" onClick={onClose}>
          {CLOSE}
        </Button>,
      ]}
    >
      <DaumPostcode onComplete={handleComplete} />
    </Modal>
  );
};

export default DaumPostcodeModal;
