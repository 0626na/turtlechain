import React, { useState } from 'react';
import { t } from 'i18next';
import { TurtleBadge, TurtleText, TurtleTooltip } from '@components/element';
import { PendingItem, SelectedWholesale } from '@store/vendorCartState';
import { Input, message, Popover, Radio, Space, Switch, Table } from 'antd';

import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { TurtleIcon } from '@components/element';

import { Wholesale, VendorAccount } from '@apis/vendorAPI';
import { css } from '@emotion/react';
import { TurtleConfirmModal } from '@components/element';
import TurtleModalInput from '@components/element/input/TurtleModalInput';
import useVendorCart from '@hooks/useVendorCart';

interface Props {
  isLoading: boolean;
}

function PendingTab({ isLoading }: Props) {
  const { cart, setCart } = useVendorCart();

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentValue, setModalContentValue] = useState('');
  const [selectedRow, setSelectedRow] = useState<PendingItem>();

  const openMemoModal = () => {
    setModalVisible(true);
  };

  const closeMemoModal = () => {
    setModalVisible(false);
  };

  const findWsStore = (wsStoreList: Wholesale[], wsStoreId: number) => {
    let result = wsStoreList.find(
      (wholesale: Wholesale) => wholesale.id === wsStoreId,
    ) as SelectedWholesale;

    result = {
      ...result,
      selectedAccount:
        result?.store_account.length === 1
          ? result.store_account[0]
          : undefined,
    };

    return result;
  };

  const handleWholesaleStoreSelecte = (
    wsStoreId: number,
    target: PendingItem,
  ) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              selectedWsStoreInfo: findWsStore(target.ws_store_info, wsStoreId),
            }
          : item,
      ),
    }));
  };

  const handleVatIncludedUpdate = (target: PendingItem) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList?.map((item) =>
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
    target: PendingItem,
  ) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              useVendorName: newVendorName,
            }
          : item,
      ),
    }));
  };

  const handleMemoUpdate = (newMemo: string, target: PendingItem) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList?.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              memo: newMemo,
            }
          : item,
      ),
    }));
  };

  const handleAccountSelecte = (
    account: VendorAccount,
    target: PendingItem,
  ) => {
    setCart((cart) => ({
      ...cart,
      pendingList: cart.pendingList.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              selectedWsStoreInfo: {
                ...target.selectedWsStoreInfo!,
                selectedAccount: account,
              },
            }
          : item,
      ),
    }));

    return;
  };

  const convertToSuccessItem = (target: PendingItem) => {
    return {
      ...target,
      ws_store_info: [
        {
          ...target.selectedWsStoreInfo!,
          store_account: [target.selectedWsStoreInfo?.selectedAccount!],
        },
      ],
    };
  };

  const passingToSuccessTab = (target: PendingItem) => {
    setTimeout(() => {
      setCart((cart) => ({
        ...cart,
        successList: [convertToSuccessItem(target), ...cart.successList],
        pendingList: cart.pendingList.filter(
          (item) => item.vendor_code !== target.vendor_code,
        ),
      }));

      message.success('성공탭으로 이동');
    }, 500);
  };

  return (
    <>
      <TurtleConfirmModal
        visible={modalVisible}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요 👀',
        ]}
        children={
          <div css={ModalInputContainer}>
            <TurtleModalInput
              placeholder="ex) 영수증 이중으로 확인 또 확인!"
              defaultValue={selectedRow?.memo}
              onChange={(e) => {
                setModalContentValue(e.currentTarget.value);
              }}
            />
          </div>
        }
        onCancel={() => {
          setModalContentValue('');
          closeMemoModal();
        }}
        onOk={() => {
          handleMemoUpdate(modalContentValue, selectedRow!);
          setModalContentValue('');
          closeMemoModal();
        }}
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
            title: '매칭',
            width: 50,
            ellipsis: true,
            render: (_, record) => {
              if (record.selectedWsStoreInfo?.selectedAccount) {
                passingToSuccessTab(record);

                return <TurtleIcon name="matching" />;
              }

              return <TurtleIcon name="misMatching" />;
            },
          },
          {
            title: '거래처코드',
            width: 85,
            ellipsis: true,
            render: (_, record) => record.vendor_code,
          },
          {
            title: '쇼핑몰 입력값',
            width: 200,
            ellipsis: true,
            render: (_, record) => {
              return `${record.name}  ${record.address}`;
            },
          },
          {
            title: '거래처명',
            width: 250,
            ellipsis: true,
            render: (_, record) => {
              if (record.ws_store_info.length === 1) {
                return record.selectedWsStoreInfo?.name;
              }

              return (
                <TurtleBadge
                  count={record.ws_store_info.length}
                  color="#F47E12"
                >
                  <Popover
                    content={
                      <Radio.Group value={record.selectedWsStoreInfo?.id}>
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
            title: '거래처 주소',
            width: 150,
            ellipsis: true,
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
            title: '휴대번호',
            width: 130,
            ellipsis: true,
            render: (_, record) =>
              record.selectedWsStoreInfo?.store_phone[0]?.phone
                .replace(/[^0-9]/, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
          },
          {
            title: '계좌정보',
            width: 300,
            ellipsis: true,
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

              if (record.selectedWsStoreInfo?.store_account.length === 1) {
                return (
                  <span>
                    {defaultBank} {defaultAccountNumber} {defaultAccountHolder}
                  </span>
                );
              }

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
            title: t('table.vatIncluded'),
            width: 90,
            align: 'center',
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
            title: (
              <>
                <TurtleText>사용할 거래처명</TurtleText>
                <TurtleTooltip content="추천하는 거래처명이 아닌 다른 거래처명으로 사용하고 싶은 경우, 자유롭게 입력해주세요." />
              </>
            ),
            render: (_, record) => (
              <Input
                size="small"
                defaultValue={record.name}
                onChange={(e) => {
                  handleUseVendorNameUpdate(e.currentTarget.value, record);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            align: 'center',
            width: '6%',
            title: '메모',
            render: (_, record) => {
              return (
                <MemoIcon
                  onClick={() => {
                    setSelectedRow(record);
                    openMemoModal();
                  }}
                  css={{
                    cursor: 'pointer',
                    stroke: record.memo === '' ? '#A1A2A6' : '#2ab8c1',
                  }}
                />
              );
            },
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

const ModalInputContainer = css`
  margin-top: 24px;
`;

export default PendingTab;
