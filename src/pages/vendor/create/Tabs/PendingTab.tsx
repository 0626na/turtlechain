import React, { useState } from 'react';
import { t } from 'i18next';
import { TurtleBadge, TurtleText, TurtleTooltip } from '@components/element';
import { vendorCartState, PendingItem } from '@store/vendorCartState';
import { Input, Popover, Radio, Space, Switch, Table } from 'antd';
import { useRecoilState } from 'recoil';

import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { ReactComponent as MatchingIcon } from '@icons/matching.svg';

import { Wholesale, VendorAccount } from '@apis/vendorAPI';
import { css } from '@emotion/react';
import { TurtleConfirmModal } from '@components/element';
import TurtleModalInput from '@components/element/input/TurtleModalInput';

//TODO: success로 이전했을때 row 컬러 변경
interface Props {
  isLoading: boolean;
}

function PendingTab({ isLoading }: Props) {
  const [vendorCartLists, setVendorCartLists] = useRecoilState(vendorCartState);
  // const vendorCartCounts = useSetRecoilState(vendorCartCountsState);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentValue, setModalContentValue] = useState('');
  const [selectedRow, setSelectedRow] = useState<PendingItem>();
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleWholesaleSelecte = (wsStoreId: number, target: PendingItem) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList.map((item) =>
        item.vendor_code === target.vendor_code
          ? {
              ...target,
              selectedWsStoreInfo: target.ws_store_info.find(
                (wholesale: Wholesale) => wholesale.id === wsStoreId,
              ),
            }
          : item,
      ),
    }));
  };

  const handleVatIncludedUpdate = (target: PendingItem) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === target.vendor_code
          ? {
              ...vendor,
              isVatIncluded: !target.isVatIncluded,
            }
          : vendor,
      ),
    }));
  };

  const handleUseVendorNameUpdate = (
    newVendorName: string,
    target: PendingItem,
  ) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === target.vendor_code
          ? {
              ...vendor,
              use_vendor_name: newVendorName,
            }
          : vendor,
      ),
    }));
  };

  const handleMemoUpdate = (newMemo: string, target: PendingItem) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === target.vendor_code
          ? {
              ...vendor,
              memo: newMemo,
            }
          : vendor,
      ),
    }));
  };

  const handleAccountSelecte = (
    account: VendorAccount,
    target: PendingItem,
  ) => {
    const newItem = {
      ...vendorCartLists.pendingList.find(
        (item) => item.vendor_code === target.vendor_code,
      )!,
      selectedWsStoreInfo: {
        ...target.selectedWsStoreInfo!,
        selectedAccount: account,
      },
    };

    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList.filter(
        (item) => item.vendor_code === target.vendor_code,
      ),
    }));

    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      successList: [
        {
          ...newItem,
          ws_store_info: [
            {
              ...newItem.selectedWsStoreInfo,
              vendor_account: [newItem.selectedWsStoreInfo.selectedAccount],
              vendor_address: newItem.selectedWsStoreInfo.address,
              vendor_name: newItem.selectedWsStoreInfo.name,
            },
          ],
        },

        ...vendorCartLists.successList,
      ],
    }));

    // setVendorCartLists((vendorCartLists) => ({
    //   ...vendorCartLists,
    //   successList: [
    //     ...vendorCartLists.successList,
    //     {
    //       id: newItem.id,
    //       name: newItem.name,
    //       phone: "",
    //       address: newItem.selectedWsStoreInfo.address,
    //       store_account: newItem.selectedWsStoreInfo.selectedAccount,
    //       store_phone: newItem.store_phone[0],
    //       // company: VendorCompany[];
    //       building: newItem.selectedWsStoreInfo.building,
    //       floor: newItem.selectedWsStoreInfo.floor,
    //       col: newItem.selectedWsStoreInfo.col,
    //       loc: newItem.selectedWsStoreInfo.loc,
    //       ext: newItem.selectedWsStoreInfo.ext,
    //       ws_store_info : newItem.ws_store_info
    //     },
    //   ],
    // }));

    return;
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
                const value = e.currentTarget.value;
                setModalContentValue(value);
              }}
            />
          </div>
        }
        onCancel={() => {
          setModalContentValue('');
          closeModal();
        }}
        onOk={() => {
          handleMemoUpdate(modalContentValue, selectedRow!);
          setModalContentValue('');
          closeModal();
        }}
      />

      <Table
        size="small"
        loading={isLoading}
        dataSource={vendorCartLists.pendingList}
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
            render: (_) => <MatchingIcon />,
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
            width: 340,
            ellipsis: true,
            render: (_, record) => {
              if (record?.selectedWsStoreInfo) {
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
                                  handleWholesaleSelecte(id, record);
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
            width: 200,
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
            width: 200,
            ellipsis: true,
            render: (_, record) => {
              if (!record?.selectedWsStoreInfo)
                // 선택된 매장이 없을때
                return (
                  <span
                    css={css`
                      color: '#a1a2a6';
                    `}
                  >
                    -
                  </span>
                );

              if (record.selectedWsStoreInfo?.store_account.length === 1) {
                handleAccountSelecte(
                  record.selectedWsStoreInfo?.store_account[0],
                  record,
                );

                return;
              }

              const {
                bank: defaultBank,
                account_number: defaultAccountNumber,
                account_holder: defaultAccountHolder,
              } = record.selectedWsStoreInfo?.store_account[0];

              const {
                id: selectedAccountId,
                bank: selectedBank,
                account_number: selectedAccountNumber,
                account_holder: selectedAccountHolder,
              } = record.selectedWsStoreInfo.selectedAccount!;

              return (
                <TurtleBadge
                  count={record.selectedWsStoreInfo?.store_account.length}
                  color="#F47E12"
                >
                  <Popover
                    content={
                      <Radio.Group value={selectedAccountId}>
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
                      {selectedBank ?? defaultBank}{' '}
                      {selectedAccountNumber ?? defaultAccountNumber}{' '}
                      {selectedAccountHolder ?? defaultAccountHolder}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },

          {
            ellipsis: true,
            title: t('table.column.vatIncluded'),
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
                  const value = e.currentTarget.value;
                  handleUseVendorNameUpdate(value, record);
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
                    openModal();
                  }}
                  css={css`
                    cursor: pointer;
                    stroke: ${record.memo === '' ? '#A1A2A6' : '#2ab8c1'}; ;
                  `}
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
