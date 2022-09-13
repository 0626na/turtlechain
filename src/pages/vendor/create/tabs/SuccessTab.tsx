import React, { useState } from 'react';
import { t } from 'i18next';
import {
  MemoIcon,
  TurtleIcon,
  TurtleText,
  TurtleTooltip,
} from '@components/element';
import { SuccessItem } from '@store/vendorCartState';
import { Input, Switch, Table } from 'antd';

import { css } from '@emotion/react';

import useVendorCart from '@hooks/useVendorCart';
import InputModal from '@components/combine/modal/InputModal';
import useModal from '@hooks/useModal';

interface Props {
  isLoading: boolean;
}

function SuccessTab({ isLoading }: Props) {
  const { cart, setCart } = useVendorCart();

  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();
  const [selectedRow, setSelectedRow] = useState<SuccessItem>();

  const handleVatIncludedUpdate = (target: SuccessItem) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              isVatIncluded: !target.isVatIncluded,
            }
          : item,
      ),
    }));
  };

  const handleUseVendorNameUpdate = (
    newVendorName: string,
    target: SuccessItem,
  ) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              useVendorName: newVendorName,
            }
          : item,
      ),
    }));
  };

  const handleVendorRemove = (targetVendorCode: string) => {
    setCart(() => ({
      ...cart,
      successList: cart.successList.filter(
        (item) => item.vendor_code !== targetVendorCode,
      ),
    }));
  };

  const handleMemoUpdate = (newMemo: string, target: SuccessItem) => {
    setCart((cart) => ({
      ...cart,
      successList: cart.successList?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              memo: newMemo,
            }
          : item,
      ),
    }));
  };

  const handleColumnHighlight = (target: SuccessItem) => {
    // 보류에서 넘어온 아이템 색상 변경
    return {
      style: {
        backgroundColor:
          target.match_type !== 'success' ? ' #DDF3F5' : 'transparent',
      },
    };
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
          handleMemoUpdate(value, selectedRow!);
          closeMemoModal();
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
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
        scroll={{ y: 'auto', x: 1400 }}
        columns={[
          {
            ellipsis: true,
            width: 85,
            title: t('table.vendorCode'),
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => record.vendor_code,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.retailerStoreInput'),
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => {
              return `${record.name}  ${record.address}`;
            },
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.vendorName'),
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => record.ws_store_info[0]?.name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => record.ws_store_info[0]?.address,
          },
          {
            ellipsis: true,
            width: 130,
            title: t('table.mobile'),
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) =>
              record.ws_store_info[0]?.store_phone[0]?.phone
                .replace(/[^0-9]/, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
          },
          {
            ellipsis: true,
            width: 300,
            title: t('table.accountInfo'),
            onCell: (record) => handleColumnHighlight(record),
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
            width: 100,
            title: t('table.vatIncluded'),
            align: 'center',
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => {
              return (
                <Switch
                  css={$switch}
                  checked={record.isVatIncluded}
                  onClick={() => {
                    handleVatIncludedUpdate(record);
                  }}
                />
              );
            },
          },

          {
            ellipsis: true,
            width: 200,
            title: (
              <>
                <TurtleText>{t('table.retailerStoreInput')}</TurtleText>
                <TurtleTooltip content="추천하는 거래처명이 아닌 다른 거래처명으로 사용하고 싶은 경우, 자유롭게 입력해주세요." />
              </>
            ),

            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => (
              <Input
                size="small"
                defaultValue={
                  //보류에서 이미 수정했다면 useVenderName으로 보여준다.
                  record.useVendorName || record.ws_store_info[0].name
                }
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  handleUseVendorNameUpdate(value, record);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 50,
            title: t('table.memo'),
            align: 'center',
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => (
              <MemoIcon
                onClick={() => {
                  setSelectedRow(record);
                  openMemoModal();
                }}
                value={record.memo}
              />
            ),
          },
          {
            ellipsis: true,
            width: 30,
            align: 'center',
            onCell: (record) => handleColumnHighlight(record),
            render: (_, record) => (
              <TurtleIcon
                name="delete"
                onClick={() => {
                  handleVendorRemove(record.vendor_code);
                }}
              />
            ),
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
