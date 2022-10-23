import { t } from 'i18next';
import React, { useState } from 'react';
import { MemoIcon, TurtleBadge } from '@components/element';
import { PendingItem } from '@store/vendorCartState';
import { Input, Popover, Radio, Space, Switch, Table } from 'antd';

import { TurtleIcon } from '@components/element';

import { css } from '@emotion/react';
import useVendorCart from '@hooks/useVendorCart';
import useModal from '@hooks/useModal';
import InputModal from '@components/combine/modal/InputModal';
import { TextWithTooltip } from '@components/combine';

interface Props {
  isLoading: boolean;
}

//todo :  매칭성공시 성공탭의 갯수를 successList.length + pendingList.lenght로 변경할것.
function PendingTab({ isLoading }: Props) {
  const {
    cart,
    vatIncludedUpdate,
    handleUseVendorNameUpdate,
    memoUpdate,
    handleWholesaleStoreSelecte,
    handleAccountSelecte,
  } = useVendorCart();

  //modal
  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();
  const [selectedRow, setSelectedRow] = useState<PendingItem>();

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
          memoUpdate(value, selectedRow as PendingItem, 'pendingList');
          closeMemoModal();
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요 👀',
        ]}
        placeholder="ex. 영수증 이중으로 확인 또 확인!"
      />

      <Table
        size="small"
        loading={isLoading}
        dataSource={cart.pendingList}
        rowKey={(record) => record.vendor_code}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        scroll={{ y: 'auto', x: 1400 }}
        columns={[
          {
            ellipsis: true,
            width: 50,
            title: t('table.matching'),
            render: (_, record) => {
              if (record.isMatching) {
                // passingToSuccessTab(record);
                return <TurtleIcon name="matching" />;
              }
              return <TurtleIcon name="misMatching" />;
            },
          },
          {
            ellipsis: true,
            width: 85,
            title: t('table.vendorCode'),
            render: (_, record) => record.vendor_code,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.retailerStoreInput'),
            render: (_, record) => {
              return `${record.name}  ${record.address}`;
            },
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.vendorName'),
            render: (_, record) => {
              return (
                <TurtleBadge
                  count={record.ws_store_info.length}
                  color="#F47E12"
                >
                  <Popover
                    content={
                      <Radio.Group
                        defaultValue={record.ws_store_info[0].id}
                        value={record.selectedWsStoreInfo?.id}
                      >
                        <Space direction="vertical">
                          {record.ws_store_info.map(
                            ({ name: wsName, address: wsAddress, id }) => (
                              <Radio
                                key={id}
                                value={id}
                                onClick={() => {
                                  handleWholesaleStoreSelecte(id, record);
                                }}
                              >
                                <span>{wsName}</span> |
                                <span
                                  css={css`
                                    color: #a1a2a6;
                                  `}
                                >
                                  {wsAddress}
                                </span>
                              </Radio>
                            ),
                          )}
                        </Space>
                      </Radio.Group>
                    }
                  >
                    <span
                      css={css`
                        color: ${record.selectedWsStoreInfo?.name
                          ? ''
                          : '#a1a2a6'};
                      `}
                    >
                      {record.selectedWsStoreInfo?.name ??
                        record.ws_store_info[0]?.name}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            ellipsis: true,
            title: t('table.vendorAddress'),
            width: 150,
            render: (_, record) => {
              if (record?.selectedWsStoreInfo) {
                return record.selectedWsStoreInfo?.address;
              }

              return (
                <span
                  css={css`
                    color: #a1a2a6;
                  `}
                >
                  {record.ws_store_info[0].address}
                </span>
              );
            },
          },
          {
            ellipsis: true,
            width: 130,
            title: t('table.mobile'),
            render: (_, record) =>
              record.selectedWsStoreInfo?.store_phone[0]?.phone
                .replace(/[^0-9]/, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
          },
          {
            ellipsis: true,
            width: 300,
            title: t('table.accountInfo'),
            render: (_, record) => {
              if (!record?.selectedWsStoreInfo)
                return (
                  <span
                    css={css`
                      color: '#a1a2a6';
                    `}
                  >
                    -
                  </span>
                );

              const {
                bank: defaultBank,
                account_number: defaultAccountNumber,
                account_holder: defaultAccountHolder,
              } = record.selectedWsStoreInfo?.store_account[0];

              return (
                <TurtleBadge
                  count={record.selectedWsStoreInfo?.store_account.length}
                  color="#F47E12"
                >
                  <Popover
                    content={
                      <Radio.Group
                        value={record.selectedWsStoreInfo.selectedAccount?.id}
                      >
                        <Space direction="vertical">
                          {record.selectedWsStoreInfo?.store_account.map(
                            (account) => (
                              <Radio
                                value={account.id}
                                key={account.id}
                                onClick={() => {
                                  handleAccountSelecte(account, record);
                                }}
                              >
                                {account.bank} {account.account_number}{' '}
                                {account.account_holder}
                              </Radio>
                            ),
                          )}
                        </Space>
                      </Radio.Group>
                    }
                  >
                    <span
                      css={css`
                        color: ${record.selectedWsStoreInfo.selectedAccount
                          ? ''
                          : '#a1a2a6'};
                      `}
                    >
                      {record.selectedWsStoreInfo.selectedAccount?.bank ??
                        defaultBank}{' '}
                      {record.selectedWsStoreInfo.selectedAccount
                        ?.account_number ?? defaultAccountNumber}{' '}
                      {record.selectedWsStoreInfo.selectedAccount
                        ?.account_holder ?? defaultAccountHolder}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },

          {
            ellipsis: true,
            width: 150,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  '당일결제 시, 부가세도 그 날에 함께 ',
                  '전달되어야 하는 거래처를 체크해주세요. ',
                ]}
              >
                {t('table.vatIncluded')}
              </TextWithTooltip>
            ),
            align: 'center',
            render: (_, record) => {
              return (
                <Switch
                  css={$switch}
                  checked={record.isVatIncluded}
                  onClick={() => {
                    vatIncludedUpdate(record, 'pendingList');
                  }}
                />
              );
            },
          },
          {
            ellipsis: true,
            width: 200,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  '추천하는 거래처명이 아닌 다른 거래처명으로 사용하고 싶은 경우, 자유롭게 입력해주세요.',
                ]}
              >
                {t('table.useVendorName')}
              </TextWithTooltip>
            ),
            render: (_, record) => (
              <Input
                size="small"
                defaultValue={record.name}
                onChange={(e) => {
                  handleUseVendorNameUpdate(
                    e.currentTarget.value,
                    record,
                    'pendingList',
                  );
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 50,
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

export default PendingTab;
