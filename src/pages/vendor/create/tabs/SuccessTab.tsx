import React, { useState } from 'react';
import { t } from 'i18next';
import {
  MemoIcon,
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableInput,
} from '@components/element';
import { SuccessItem } from '@store/vendorCartState';
import { Switch, Table } from 'antd';

import { css } from '@emotion/react';

import useVendorCart from '@hooks/useVendorCart';
import InputModal from '@components/combine/modal/InputModal';
import useModal from '@hooks/useModal';
import { TextWithTooltip } from '@components/combine';
import { phoneMaskingPattern } from '@utils/pattern';
import { phoneMasking } from '@utils/phone';

interface Props {
  isLoading: boolean;
}

function SuccessTab({ isLoading }: Props) {
  const {
    cart,
    vatIncludedUpdate,
    handleUseVendorNameUpdate,
    memoUpdate,
    vendorRemove,
  } = useVendorCart();

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
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
        placeholder={t('placeholder.ex, double check its invoices!')}
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
            title: t('table.retailerStoreInput'),
            render: (_, record) => `${record.name}  ${record.address}`,
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
            width: 130,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  t(
                    'description.write freely of what you wish to use as vendors name',
                  ),
                ]}
              >
                {t('table.useVendorName')}
              </TextWithTooltip>
            ),

            render: (_, record) => (
              <TurtleTableInput
                size="small"
                defaultValue={record.useVendorName}
                onChange={(e) => {
                  handleUseVendorNameUpdate(
                    e.currentTarget.value,
                    record,
                    'successList',
                  );
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
