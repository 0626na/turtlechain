import { t } from 'i18next';
import React, { useState } from 'react';
import { MemoIcon } from '@components/element';
import { PendingItem } from '@store/vendorCartState';
import { Dropdown, Menu, Switch, Table, Tooltip } from 'antd';

import { TurtleIcon } from '@components/element';

import { css } from '@emotion/react';
import useVendorCart from '@hooks/useVendorCart';
import useModal from '@hooks/useModal';
import InputModal from '@components/combine/modal/InputModal';
import { TextWithTooltip } from '@components/combine';
import { theme } from '@styles/theme';

import { phoneMasking } from '@utils/etc';

interface Props {
  isLoading: boolean;
}

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
        title={t('table.memo')}
        description={[
          t('description.input important memo'),
          t('description.make use of memo'),
        ]}
        placeholder={t('placeholder.ex, double check its invoices!')}
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
        scroll={{ y: 'auto', x: 950 }}
        columns={[
          {
            ellipsis: true,
            width: 100,
            title: t('table.matching'),
            align: 'center',
            render: (_, record) => (
              <TurtleIcon
                name={record.isMatching ? 'matching' : 'misMatching'}
              />
            ),
          },
          {
            ellipsis: true,
            width: 90,

            title: t('table.vendorCode'),
            render: (_, record) => record.vendor_code,
          },
          {
            ellipsis: true,
            title: t('table.retailerStoreInput'),
            render: (_, record) => {
              return `${record.name}  ${record.address}`;
            },
          },
          {
            ellipsis: true,
            title: t('table.vendorName'),
            render: (_, record) => (
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Dropdown
                  overlay={
                    <Menu
                      css={css`
                        position: absolute;
                        top: -20px;
                        left: 25px;
                        background: #ffffff;
                        box-shadow: 0px 4px 18px rgba(34, 44, 56, 0.2);
                        border-radius: 8px;
                      `}
                      items={record.ws_store_info.map(
                        ({ name: wsName, address: wsAddress, id }) => ({
                          style: {
                            width: 250,
                            maxWidth: 400,
                          },
                          key: id,
                          label: (
                            <>
                              <span
                                css={{
                                  fontSize: 14,
                                  color: theme.grey700,
                                  marginRight: 8,
                                }}
                              >
                                {wsName}
                              </span>
                              <span
                                css={{
                                  color: theme.grey400,
                                }}
                              >
                                {wsAddress}
                              </span>
                            </>
                          ),
                          onClick: () => {
                            handleWholesaleStoreSelecte(id, record);
                          },
                          onMouseEnter: (e) => {
                            e.domEvent.currentTarget.style.backgroundColor =
                              theme.bgGrey;
                          },
                          onMouseLeave: (e) => {
                            e.domEvent.currentTarget.style.backgroundColor =
                              theme.white;
                          },
                        }),
                      )}
                    />
                  }
                  trigger={['click']}
                  arrow={false}
                >
                  <span
                    css={{
                      lineHeight: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip title={t('description.select specific info')}>
                      <div
                        css={{
                          marginRight: 4,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#F47E12',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: 12,
                          color: '#fff',
                          fontWeight: 500,
                        }}
                      >
                        {record.ws_store_info.length}
                      </div>
                    </Tooltip>
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
                  </span>
                </Dropdown>
              </div>
            ),
          },
          {
            ellipsis: true,
            title: t('table.vendorAddress'),
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
            title: t('table.mobile'),
            render: (_, record) =>
              phoneMasking(
                record.selectedWsStoreInfo?.store_phone[0]?.phone ?? '',
              ),
          },

          {
            ellipsis: true,

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
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <Dropdown
                    overlay={
                      <Menu
                        css={css`
                          position: absolute;
                          top: -20px;
                          left: 25px;
                          background: #ffffff;
                          box-shadow: 0px 4px 18px rgba(34, 44, 56, 0.2);
                          border-radius: 8px;
                        `}
                        items={record.selectedWsStoreInfo?.store_account.map(
                          (account) => ({
                            style: {
                              width: 250,
                              maxWidth: 400,
                            },
                            key: Number(account.id),
                            label: (
                              <>
                                <span
                                  css={{
                                    color: theme.grey400,
                                  }}
                                >
                                  {account.bank} {account.account_number}{' '}
                                  {account.account_holder}
                                </span>
                              </>
                            ),
                            onClick: () => {
                              handleAccountSelecte(account, record);
                            },
                            onMouseEnter: (e) => {
                              e.domEvent.currentTarget.style.backgroundColor =
                                theme.bgGrey;
                            },
                            onMouseLeave: (e) => {
                              e.domEvent.currentTarget.style.backgroundColor =
                                theme.white;
                            },
                          }),
                        )}
                      />
                    }
                    trigger={['click']}
                    arrow={false}
                  >
                    <span
                      css={{
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip title={t('description.select specific info')}>
                        <div
                          css={{
                            marginRight: 4,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#F47E12',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 12,
                            color: '#fff',
                            fontWeight: 500,
                          }}
                        >
                          {record.selectedWsStoreInfo?.store_account.length}
                        </div>
                      </Tooltip>
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
                    </span>
                  </Dropdown>
                </div>
              );
            },
          },

          {
            ellipsis: true,
            width: 130,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  t('description.payment today'),
                  t('description.check vendor'),
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
          // {
          //   ellipsis: true,
          //   width: 150,
          //   title: (
          //     <TextWithTooltip
          //       tooltipContent={[t('description.another vendor name')]}
          //     >
          //       {t('table.useVendorName')}
          //     </TextWithTooltip>
          //   ),
          //   render: (_, record) => (
          //     <TurtleTableInput
          //       size="small"
          //       defaultValue={record.name}
          //       onChange={(e) => {
          //         handleUseVendorNameUpdate(
          //           e.currentTarget.value,
          //           record,
          //           'pendingList',
          //         );
          //       }}
          //     />
          //   ),
          // },
          {
            ellipsis: true,

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
