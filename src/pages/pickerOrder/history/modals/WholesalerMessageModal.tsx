import { TurtleContentModal } from '@components/combine';
import { Table } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function WholesalerMessageModal({ visible, onClose }: Props) {
  return (
    <>
      <TurtleContentModal
        title={t('title.vendor detail message')}
        visible={visible}
        onClose={onClose}
      >
        <Table
          columns={[
            {
              title: t('table.vendorName'),
            },
            {
              title: t('table.`vendorProductName'),
            },
            {
              title: t(''),
            },
          ]}
        />
      </TurtleContentModal>
    </>
  );
}

export default WholesalerMessageModal;
