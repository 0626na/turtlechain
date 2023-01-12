import React from 'react';
import { TurtleContentModal } from '@components/combine';
import { Table } from 'antd';
import { t } from 'i18next';
import { useQuery } from 'react-query';
import orderAPI from '@apis/orderAPI';
import useOrderCart from '@hooks/useOrderCart';

interface Props {
  visible: boolean;
  onClose: () => void;
  sheetID: number;
}

function WholesalerMessageModal({ visible, onClose, sheetID }: Props) {
  const { data: orderVendorMessageData } = useQuery(
    ['getOrderVendorMessage', sheetID],
    () => orderAPI.getOrderHistory({ sheet_id: sheetID }),
    { enabled: visible },
  );
  const { translateOrderType } = useOrderCart();

  return (
    <>
      <TurtleContentModal
        size="large"
        title={t('title.vendor detail message')}
        visible={visible}
        onClose={onClose}
      >
        <Table
          size="small"
          rowKey={(record) => record.id}
          scroll={{ y: 'auto', x: 950 }}
          pagination={{
            position: ['bottomCenter'],
          }}
          dataSource={orderVendorMessageData?.data.successes}
          columns={[
            {
              title: t('table.vendorName'),
              width: 148,
              render: (_, record) => record.vendor_name,
            },
            {
              title: t('table.vendorProductName'),
              width: 196,
              render: (_, record) => record.name,
            },
            {
              title: t('table.option'),
              width: 136,
              render: (_, record) => record.option,
            },
            {
              title: t('table.type'),
              width: 116,
              render: (_, record) => translateOrderType(record.type),
            },
            {
              title: t('table.message'),
              align: 'left',
              render: (_, record) => {
                let strComment = '';
                record.comments.map((comment, index) => {
                  if (record.comments.length === index + 1) {
                    strComment += `${comment.content}`;
                    return;
                  }
                  strComment += `${comment.content}, `;
                });

                return strComment;
              },
            },
            {},
          ]}
        />
      </TurtleContentModal>
    </>
  );
}

export default WholesalerMessageModal;
