import React, { useState } from 'react';
import { t } from 'i18next';
import { TurtleBadge, TurtleText, TurtleTooltip } from '@components/element';
import {
  vendorCartCountsState,
  vendorCartState,
  PendingItem,
  SelectedWholesale,
} from '@store/vendorCartState';
import { Input, Popover, Radio, Space, Switch, Table } from 'antd';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { ReactComponent as MatchingIcon } from '@icons/matching.svg';

import { Wholesale } from '@apis/vendorAPI';
import { css } from '@emotion/react';
import { TurtleAnswerModal } from '@components/combine';
import TurtleModalInput from '@components/element/input/TurtleModalInput';

interface Props {
  isLoading: boolean;
}

function PendingTab({ isLoading }: Props) {
  const [vendorCartLists, setVendorCartLists] = useRecoilState(vendorCartState);
  const vendorCartCounts = useSetRecoilState(vendorCartCountsState);

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

  // const findWsStoreInfo = (item) => {
  //   return item .
  // }

  // const handle;

  const handleVatIncludedUpdate = (targetVendor: PendingItem) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === targetVendor.vendor_code
          ? {
              ...vendor,
              isVatIncluded: !targetVendor.isVatIncluded,
            }
          : vendor,
      ),
    }));
  };

  const handleselectedWholesaleNameUpdate = (
    newVendorName: string,
    targetVendor: PendingItem,
  ) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === targetVendor.vendor_code
          ? {
              ...vendor,
              use_vendor_name: newVendorName,
            }
          : vendor,
      ),
    }));
  };

  const handleMemoUpdate = (newMemo: string, targetVendor: PendingItem) => {
    setVendorCartLists((vendorCartLists) => ({
      ...vendorCartLists,
      pendingList: vendorCartLists.pendingList?.map((vendor) =>
        vendor.vendor_code === targetVendor.vendor_code
          ? {
              ...vendor,
              memo: newMemo,
            }
          : vendor,
      ),
    }));
  };

  return (
    <>
      <TurtleAnswerModal
        visible={modalVisible}
        title="메모"
        description={
          <span>
            해당 건과 관련해 중요한 내용을 기록해보세요. <br /> 개인 메모로도
            자유롭게 활용할 수 있어요 👀
          </span>
        }
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
            width: '3%',
            ellipsis: true,
            render: (_) => <MatchingIcon />,
          },
          {
            title: '거래처코드',
            width: '8%',
            ellipsis: true,
            render: (_, record) => record.vendor_code,
          },
          {
            title: '쇼핑몰 입력값',
            width: '15%',
            ellipsis: true,
            render: (_, record) => {
              return `${record.name}  ${record.address}`;
            },
          },
          {
            ellipsis: true,
            title: '거래처명',
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
                      {record.selectedWsStoreInfo
                        ? record.selectedWsStoreInfo.name
                        : record.ws_store_info[0]?.name}
                      {/* {record.selectedWsStoreInfo?.name ??
                        record.ws_store_info[0]?.name} */}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            ellipsis: true,
            title: '거래처 주소',
            render: (_, record) => {
              if (record.ws_store_info.length === 1) {
                return record.ws_store_info[0].address;
              }

              if (record.selectedWsStoreInfo) {
                return record.selectedWsStoreInfo.address;
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
            width: '10%',
            ellipsis: true,
            render: (_, record) =>
              record.selectedWsStoreInfo?.store_phone[0]?.phone
                .replace(/[^0-9]/, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
          },
          {
            title: '계좌정보',
            ellipsis: true,
            // render: (_, record) => {
            //   if (!record.selectedWsStoreInfo) return;

            //   const {
            //     bank = '',
            //     account_number = '',
            //     account_holder = '',
            //   } = record.selectedWholesale?.store_account[0] || {};

            //   if (record.selectedWholesale?.store_account.length === 1) {
            //     return (
            //       <span>
            //         {bank} {account_number} {account_holder}
            //       </span>
            //     );
            //   }

            //   <TurtleBadge
            //     count={record.selectedWholesale?.store_account.length}
            //     color="red"
            //   >
            //     <Popover
            //       content={
            //         <Radio.Group value={record.useAccount?.id}>
            //           <Space direction="vertical">
            //             {record.selectedWholesale?.store_account.map(
            //               ({ id, bank, account_number, account_holder }) => (
            //                 <Radio
            //                   value={id}
            //                   key={id}
            //                   onClick={() => {
            //                     setSuggestAccount(record, id);
            //                   }}
            //                 >
            //                   {bank} {account_number} {account_holder}
            //                 </Radio>
            //               ),
            //             )}
            //           </Space>
            //         </Radio.Group>
            //       }
            //     >
            //       <div style={{ color: record.check_account ? '' : 'red' }}>
            //         {record.use_account?.bank ??
            //           record.use_vendor.store_account[0]?.bank}{' '}
            //         {record.use_account?.account_number ??
            //           record.use_vendor.store_account[0]?.account_number}{' '}
            //         {record.use_account?.account_holder ??
            //           record.use_vendor.store_account[0]?.account_holder}
            //       </div>
            //     </Popover>
            //   </TurtleBadge>;

            //   return `${bank} ${account_number} ${account_holder}`;

            //   return '거래처를 선택해 주세요.';
            //   // const {
            //   //   bank = '',
            //   //   account_number = '',
            //   //   account_holder = '',
            //   // } = record.ws_store_info[0]?.store_account[0] || {};
            //   // return `${bank} ${account_number} ${account_holder}`;
            // },
          },

          {
            title: t('table.column.vatIncluded'),
            ellipsis: true,
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
            title: '추천 거래처명',
            render: (_, record) => record.ws_store_info[0]?.name,
          },
          {
            ellipsis: true,
            title: (
              <>
                <TurtleText>사용할 거래처명</TurtleText>
                <TurtleTooltip content="추천하는 거래처명이 아닌 다른 거래처명으로 사용하고 싶은 경우, 자유롭게 입력해주세요." />
              </>
            ),
            // render: (_, record) => (
            //   <Input
            //     size="small"
            //     defaultValue={record.selectedWholesaleName}
            //     onChange={(e) => {
            //       const value = e.currentTarget.value;
            //       handleselectedWholesaleNameUpdate(value, record);
            //     }}
            //   />
            // ),
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
