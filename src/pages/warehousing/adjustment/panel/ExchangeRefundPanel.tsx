import { AdjustmentItem } from '@apis/adjustmentAPI';

import InputModal from '@components/combine/modal/InputModal';

import {
  ArrowRightIcon,
  MemoIcon,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useAdjustmentCart from '@hooks/useAdjustmentCart';
import useModal from '@hooks/useModal';

import { Collapse, CollapsePanelProps, Select, Table } from 'antd';

import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

interface Props extends CollapsePanelProps {
  activeKey: string;
}

function ExchangeRefundPanel({ activeKey, ...props }: Props) {
  const { cart, setCart } = useAdjustmentCart();
  const [selectedRow, setSelectedRow] = useState<AdjustmentItem>();

  const [memoModalVisible, memoModalOpen, memoModalClose] = useModal();

  //AdjustmentItemList의 필드값중 변경대상을 type으로 받아 업데이트 시킨다.
  const handleExchangeRefundItemUpdate = (
    type: string,
    index: number, // id
    value: number | string,
  ) => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.adjustmentItemList.map((item) =>
        item.index === index ? { ...item, [type]: value } : item,
      ),
    }));
  };

  const handleExchangeRefundItemDelete = (index: number) => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.adjustmentItemList.filter(
        (item) => item.index !== index,
      ),
    }));
  };

  useEffect(() => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.selectedList.map((item, index) => ({
        index,
        vendor_id: item.vendor_info.id,
        vendor_name: item.vendor_info.vendor_name,
        vendor_address: item.vendor_info.vendor_address,
        warehousing_item_id: item.id,
        product_id: item.product_info.id,
        product_name: item.product_info.name,
        vendor_product_name: item.product_info.vendor_product_name,
        product_option: item.product_info.option,
        product_price: item.product_info.price,
        product_count: 0,
        product_count_max: item.count,
        product_code: item.product_info.product_code,
        is_vat_included: item.is_vat_included,
        type: '',
        memo: '',
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <>
      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        //  loading={loading}
        onCancel={memoModalClose}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          handleExchangeRefundItemUpdate(
            'memo',
            selectedRow?.index as number,
            value,
          );
          memoModalClose();
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
        placeholder="ex. 영수증 이중으로 확인 또 확인!"
      />
      <Collapse.Panel
        {...props}
        style={{
          border: `${
            activeKey === '2' ? '1px solid rgba(227, 230, 234, 1)' : 'none'
          }`,
        }}
        showArrow={false}
        extra={
          <TurtleText css={{ color: '#242934' }}>
            {activeKey === '2' ? (
              <TurtleIcon name="arrowDown" />
            ) : (
              <ArrowRightIcon />
            )}
          </TurtleText>
        }
      >
        <Table
          size="small"
          dataSource={cart.adjustmentItemList}
          rowKey={(record) => record.index as number}
          pagination={false}
          scroll={{ x: 1400, y: 410 }}
          title={() => (
            <TurtleTableTitle totalCount={cart.adjustmentItemList.length} />
          )}
          columns={[
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.productName'),
              render: (_, record) => record.product_name,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.vendorProductName'),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              width: 120,
              title: t('table.productCode'),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: 120,
              title: t('table.option'),
              render: (_, record) => record.product_option,
            },
            {
              ellipsis: true,
              width: 120,
              align: 'right',
              title: t('table.price'),
              render: (_, record) => (
                <TurtleTableNumberInput
                  defaultValue={record.product_price}
                  onChange={(value) => {
                    handleExchangeRefundItemUpdate(
                      'product_price',
                      record.index as number,
                      value,
                    );
                  }}
                />
              ),
            },
            {
              width: 120,
              align: 'right',
              title: t('table.count'),
              render: (_, record) => {
                return (
                  <TurtleTableNumberInput
                    defaultValue={record.product_count}
                    max={record.product_count_max}
                    onChange={(value) => {
                      handleExchangeRefundItemUpdate(
                        'product_count',
                        record.index as number,
                        value,
                      );
                    }}
                  />
                );
              },
            },
            {
              width: 128,
              title: t('table.type'),
              render: (_, record) => (
                <Select
                  status={record.type === '' ? 'error' : ''}
                  onSelect={(value: string) => {
                    handleExchangeRefundItemUpdate(
                      'type',
                      record.index as number,
                      value,
                    );
                  }}
                  suffixIcon={<TurtleIcon name="arrowDown" />}
                  placeholder="분류선택"
                  dropdownStyle={{
                    background: '#fff',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                    borderRadius: 8,
                  }}
                  css={select}
                >
                  <Select.Option
                    style={{
                      padding: '8px 10px',
                    }}
                    key={0}
                    value="takeback"
                  >
                    교환
                  </Select.Option>
                  <Select.Option
                    style={{
                      padding: '8px 10px',
                    }}
                    key={1}
                    value="refund"
                  >
                    반품
                  </Select.Option>
                </Select>
              ),
            },
            {
              ellipsis: true,
              width: 50,
              title: t('table.memo'),
              align: 'center',
              render: (_, record) => (
                <MemoIcon
                  onClick={() => {
                    setSelectedRow(record);
                    memoModalOpen();
                  }}
                  value={record.memo as string}
                />
              ),
            },
            {
              ellipsis: true,
              width: 30,
              align: 'center',
              render: (_, record) => (
                <TurtleIcon
                  name="delete"
                  onClick={() => {
                    handleExchangeRefundItemDelete(record.index as number);
                  }}
                />
              ),
            },
          ]}
        />
      </Collapse.Panel>
    </>
  );
}

const select = css`
  width: 100%;

  &.ant-select-single .ant-select-selector .ant-select-selection-item {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 24px;
    font-size: 14px;
    color: #242934;
    border-radius: 4px;
    border-color: #d6d7da;
  }
`;
export default ExchangeRefundPanel;
