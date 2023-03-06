import React, { useState } from 'react';
import { t } from 'i18next';
import { MemoIcon, TurtleConfirmModal, TurtleIcon } from '@components/element';
import { SuccessItem } from '@store/vendorCartState';
import { Switch, Table } from 'antd';
import { css } from '@emotion/react';
import useVendorCart from '@hooks/useVendorCart';
import InputModal from '@components/combine/modal/InputModal';
import useModal from '@hooks/useModal';
import { TextWithTooltip } from '@components/combine';
import { phoneMasking } from '@utils/etc';

interface Props {
  isLoading: boolean;
}

function SuccessTab({ isLoading }: Props) {
  const { cart, vatIncludedUpdate, memoUpdate, vendorRemove } = useVendorCart();

  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();

  const [selectedRow, setSelectedRow] = useState<SuccessItem>();

  const handleVendorRemove = (targetVendorCode: string) => {
    vendorRemove(targetVendorCode);
    closeRemoveModal();
  };

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
          memoUpdate(value, selectedRow as SuccessItem, 'successList');
          closeMemoModal();
        }}
        title="메모"
        description={[
          t('description.input important memo'),
          t('description.make use of memo'),
        ]}
        placeholder={t('placeholder.ex, double check its invoices!')}
      />

      {/*
       * 삭제 확인 모달
       */}
      <TurtleConfirmModal
        title={t('title.really delete')}
        description={[t('description.cannot reset')]}
        okText={t('button.yes')}
        visible={removeModalVisible}
        onCancel={closeRemoveModal}
        onOk={() => {
          handleVendorRemove(selectedRow?.vendor_code as string);
        }}
      />

      <Table
        size="small"
        loading={isLoading}
        dataSource={cart.successList}
        rowKey={(record) => record.vendor_code}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        scroll={{ y: 'auto', x: 950 }}
        columns={[
          {
            ellipsis: true,
            width: 90,
            title: t('table.vendorCode'),
            render: (_, record) => record.vendor_code,
          },
          {
            ellipsis: true,
            title: t('table.vendorName'),
            render: (_, record) => record.ws_store_info[0]?.name,
          },
          {
            ellipsis: true,
            title: t('table.vendorAddress'),
            render: (_, record) => record.ws_store_info[0]?.address,
          },
          {
            ellipsis: true,
            width: 130,
            title: t('table.mobile'),
            render: (_, record) =>
              phoneMasking(record.ws_store_info[0]?.store_phone[0]?.phone),
          },
          {
            ellipsis: true,
            title: t('table.accountInfo'),
            render: (_, record) => {
              const {
                bank = '',
                account_number = '',
                account_holder = '',
              } = record.ws_store_info[0]?.store_account[0] || {};

              return `${bank} ${account_number} ${account_holder}`;
            },
          },
          {
            ellipsis: true,
            width: 130,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  t(
                    'description.check if VAT needs to be included with an invoice1',
                  ),
                  t(
                    'description.check if VAT needs to be included with an invoice2',
                  ),
                ]}
              >
                {t('table.vatIncluded')}
              </TextWithTooltip>
            ),
            align: 'center',
            render: (_, record) => (
              <Switch
                css={$switch}
                checked={record.isVatIncluded}
                onClick={() => {
                  vatIncludedUpdate(record, 'successList');
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 100,
            title: t('table.memo'),
            align: 'center',
            onCell: (record) => ({
              style: { cursor: 'pointer' },
              onClick: (e) => {
                e.stopPropagation();
                setSelectedRow(record);
                openMemoModal();
              },
            }),
            render: (_, record) => <MemoIcon value={record.memo} />,
          },
          {
            ellipsis: true,
            width: 50,
            align: 'center',
            onCell: (record) => ({
              style: { cursor: 'pointer' },
              onClick: (e) => {
                e.stopPropagation();
                setSelectedRow(record);
                openRemoveModal();
              },
            }),
            render: (_) => <TurtleIcon name="delete" />,
          },
        ]}
      />
    </>
  );
}

const $switch = css`
  width: 30px;

  &.ant-switch-checked {
    background-color: #1a66f9;
  }
`;

export default SuccessTab;
