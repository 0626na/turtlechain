import React, { useState } from 'react';
import {
  MemoIcon,
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import { TurtleTableWarningNumberInput } from '@components/element/input/TurtleTableNumberInput';
import TurtleNumberInput from '@components/element/input/TurtleNumberInput';
import useProductCart from '@hooks/useProductCart';
import { Table, TabPaneProps, Tabs, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import NeedUpdatePopover from '../popovers/NeedUpdatePopover';
import InputModal from '@components/combine/modal/InputModal';
import useModal from '@hooks/useModal';
import { Product } from '@apis/productAPI';
import { valueType } from 'antd/lib/statistic/utils';

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
        title={t('table.memo')}
        description={[
          t('write freely anything thats important about this vendor'),
          t('use this memo as your personal note'),
        ]}
        placeholder={t('placeholder.ex, double check its invoices!')}
      />

      {/*
       * 삭제 확인 모달
       */}
      <TurtleConfirmModal
        title={t('do you really want me to delete it?')}
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
          scroll={{ x: 950, y: 'auto' }}
          columns={[
            {
              ellipsis: true,

              title: t('table.product vendorName'),
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
              width: 100,
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
              width: 120,
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
                  onChange={(value: valueType) => {
                    updatePrice(record, Number(value));
                  }}
                />
              ),
            },
            {
              ellipsis: true,
              align: 'center',
              width: 100,
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
