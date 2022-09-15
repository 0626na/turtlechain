import { TurtleDropdown, TurtleIcon, TurtleText } from '@components/element';
import PrimaryButton from '@components/element/button/PrimaryButton';
import useModal from '@hooks/useModal';
import { PageHeader, PageTitle } from '@layout/page';
import React from 'react';

function PageBody() {
  const [addReserveModalVidible, addReserveModalOpen, addReserveModalClose] =
    useModal();

  const [
    addExchangeRefundModalVidible,
    addExchangeRefundModalOpen,
    addExchangeRefundClose,
  ] = useModal();

  return (
    <>
      <PageHeader title="교환/반품/미송" />

      <PageTitle
        title="매입조정 현황"
        buttons={[
      
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: '교환/반품 추가',
                icon: <TurtleIcon name="exchangeRefund" />,
                onClick () {
                  addExchangeRefundModalOpen()
                }
              },
              {
                key: '1',
                label: '미송상품 추가',
                icon: <TurtleIcon name="reserve" />,
                onClick() {
                  addReserveModalOpen();
                },
              },
            ]}
            triggerButton={<PrimaryButton>매입조정 추가</PrimaryButton>,}
          />,
        ]}
      />
    </>
  );
}

export default PageBody;
