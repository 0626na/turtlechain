import DaumPostcode, { Address } from 'react-daum-postcode';

import { AnswerButton } from '@components/element';
import TurtleContentModal from '@components/element/modal/TurtleContentModal';
import { css } from '@emotion/react';

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
    <TurtleContentModal visible={visible} onClose={onClose} title={'주소찾기'}>
      <DaumPostcode onComplete={handleComplete} />

      <div css={buttonContainer}>
        <AnswerButton text="닫기" onClick={onClose} />
      </div>
    </TurtleContentModal>
  );
}

const buttonContainer = css({
  display: 'flex',
  justifyContent: 'end',
  marginTop: 20,
});

export default DaumPostcodeModal;
