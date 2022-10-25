import React, { useState } from 'react';
import {
  MemoIcon,
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
  TurtleTableWarningNumberInput,
} from '@components/element';
import TurtleNumberInput from '@components/element/input/TurtleNumberInput';
import useProductCart from '@hooks/useProductCart';
import { Table, TabPaneProps, Tabs, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import NeedUpdatePopover from '../popovers/NeedUpdatePopover';
import InputModal from '@components/combine/modal/InputModal';
import useModal from '@hooks/useModal';
import { Product } from '@apis/productAPI';

interface Props extends TabPaneProps {
  loading: boolean;
}
function SuccessTab({ loading, ...props }: Props) {
  const { cart, updatePrice, deleteProduct, memoUpdate } = useProductCart();
  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
  const [selectedRow, setSelectedRow] = useState<Product>();

  return (
    <>
      {/*
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        onCancel={closeMemoModal}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          memoUpdate(value, selectedRow as Product);
          closeMemoModal();
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
        placeholder="ex. 영수증 이중으로 확인 또 확인!"
      />

      {/*
       * 삭제 확인 모달
       */}
      <TurtleConfirmModal
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되돌릴 수 없어요.']}
        okText="네"
        visible={removeModalVisible}
        onCancel={closeRemoveModal}
        onOk={() => {
          deleteProduct(selectedRow as Product);
          closeRemoveModal();
        }}
      />

      <Tabs.TabPane {...props}>
        <Table
          size="small"
          loading={loading}
          dataSource={cart.successList}
          rowKey={(record) => record.product_code}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 1400, y: 'auto' }}
          columns={[
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              width: 250,
              title: (
                <NeedUpdatePopover>{t('table.productName')}</NeedUpdatePopover>
              ),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: 250,
              title: t('table.vendorProductName'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.productCode'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: 100,
              title: t('table.option'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => record.option,
            },
            {
              ellipsis: true,
              title: t('table.imageUrl'),
              width: 150,
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => (
                <Typography.Link href={record.image_url} target="_blank">
                  {record.image_url}
                </Typography.Link>
              ),
            },
            {
              ellipsis: true,
              align: 'right',
              width: 150,
              title: t('table.price'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                },
              }),
              render: (_, record) => (
                <TurtleTableWarningNumberInput
                  value={record.price}
                  onChange={(value) => {
                    updatePrice(record, Number(value));
                  }}
                />
              ),
            },
            {
              ellipsis: true,
              align: 'center',
              width: 50,
              title: t('table.memo'),
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                  cursor: 'pointer',
                },
                onClick: () => {
                  setSelectedRow(record);
                  openMemoModal();
                },
              }),
              render: (_, record) => <MemoIcon value={record.memo} />,
            },
            {
              ellipsis: true,
              width: 50,
              onCell: (record) => ({
                style: {
                  backgroundColor: record.need_update
                    ? '#F2F2F3'
                    : 'transparent',
                  cursor: 'pointer',
                },
                onClick: () => {
                  setSelectedRow(record);
                  openRemoveModal();
                },
              }),
              render: (_) => <TurtleIcon name="delete" />,
            },
          ]}
        />
      </Tabs.TabPane>
    </>
  );
}

export default SuccessTab;
