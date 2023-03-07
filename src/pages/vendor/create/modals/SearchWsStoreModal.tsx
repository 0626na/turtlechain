import React, { useEffect } from 'react';
import { Pagination, Popover, Radio, Row, Space, Table } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { t } from 'i18next';
import vendorAPI, {
  RequestGetWholesale,
  VendorAccount,
  VendorPhone,
  Wholesale,
} from '@apis/vendorAPI';
import {
  SelectButton,
  TurtleBadge,
  TurtleTableTitle,
} from '@components/element';
import { SearchFilter, TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';
import { message } from '@utils/message';
import { phoneMasking } from '@utils/etc';
interface Props {
  visible: boolean;
  closeModal: () => void;
  onFieldFillin: (wholeSaleStore: Wholesale) => void;
}

function SearchWsStoreModal({ visible, closeModal, onFieldFillin }: Props) {
  const [wholesaleList, setWholesaleList] = useState<Wholesale[]>([]);

  const [searchQuery, setSearchQuery] = useState<RequestGetWholesale>({
    page: 1,
    search_string: '',
  });

  // master 도매 검색 요청
  const getWholesaleQuery = useQuery(
    ['getWholesaleQuery', searchQuery],
    () => vendorAPI.getWholesale(searchQuery),
    {
      onSuccess: (data) => {
        setWholesaleList(data.data.vendor_list);
      },
    },
  );

  const onSelectWholesale = (record: Wholesale) => {
    if (record.store_phone.length !== 1) {
      message.warn(t('message.select mobile'));

      return;
    }

    if (record.store_account.length !== 1) {
      message.warn(t('message.select account'));

      return;
    }

    onFieldFillin(record);
    closeModal();
    resetSearchQuery();
  };

  const onSelectPhone = (record: Wholesale, storePhone: VendorPhone) => {
    setWholesaleList(
      wholesaleList.map((vendor) =>
        vendor.id === record.id
          ? {
              ...vendor,
              store_phone: [storePhone],
            }
          : vendor,
      ),
    );
  };

  const onSelectAccount = (record: Wholesale, storeAccount: VendorAccount) => {
    setWholesaleList(
      wholesaleList.map((vendor) =>
        vendor.id === record.id
          ? {
              ...vendor,
              store_account: [storeAccount],
            }
          : vendor,
      ),
    );
  };

  const resetSearchQuery = () => {
    setSearchQuery({ page: 1, search_string: '' });
  };

  useEffect(() => {
    if (visible) return;

    resetSearchQuery();
  }, [visible]);

  return (
    <div
      css={css`
        z-index: 3;
      `}
    >
      <TurtleContentModal
        size="middle"
        title={t('title.vendor search')}
        visible={visible}
        onClose={() => {
          closeModal();
        }}
      >
        <Table
          size="small"
          loading={getWholesaleQuery.isLoading}
          dataSource={wholesaleList}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: 'auto' }}
          title={() => (
            <TurtleTableTitle
              totalCount={getWholesaleQuery.data?.data.total_count ?? 0}
              rightContent={
                <SearchFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getWholesaleQuery.data?.data.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: '20%',
              title: <span css={tableTitle}>{t('table.vendorName')}</span>,
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: '20%',
              title: <span css={tableTitle}>{t('table.vendorAddress')}</span>,
              render: (_, record) => {
                return `${record.building} ${
                  record.floor && record.floor + '층'
                } ${record.col} ${record.loc} ${record.ext}`;
              },
            },
            {
              ellipsis: true,
              width: '20%',
              title: <span css={tableTitle}>{t('table.mobile')}</span>,
              render: (_, record) => {
                if (record.store_phone.length === 1) {
                  return phoneMasking(record.store_phone[0].phone);
                }

                return (
                  <TurtleBadge count={record.store_phone.length}>
                    <Popover
                      content={
                        <>
                          <Radio.Group>
                            <Space direction="vertical">
                              {record.store_phone.map((storePhone) => (
                                <Radio
                                  value={storePhone.phone}
                                  key={storePhone.id}
                                  onClick={() => {
                                    onSelectPhone(record, storePhone);
                                  }}
                                >
                                  {phoneMasking(storePhone.phone)}
                                </Radio>
                              ))}
                            </Space>
                          </Radio.Group>
                        </>
                      }
                    >
                      <span style={{ color: '#a1a2a6', cursor: 'pointer' }}>
                        {phoneMasking(record.store_phone[0]?.phone)}
                      </span>
                    </Popover>
                  </TurtleBadge>
                );
              },
            },
            {
              ellipsis: true,
              title: <span css={tableTitle}>{t('table.accountInfo')}</span>,
              render: (_, record) => {
                const makeAddress = ({
                  bank,
                  account_number,
                  account_holder,
                }: VendorAccount) => {
                  return `${bank} ${account_number} ${account_holder}`;
                };

                if (record.store_account.length === 0) {
                  return;
                }

                if (record.store_account.length === 1) {
                  return makeAddress(record.store_account[0]);
                }

                return (
                  <TurtleBadge count={record.store_account.length}>
                    <Popover
                      content={
                        <>
                          <Radio.Group>
                            <Space direction="vertical">
                              {record.store_account.map((storeAccount) => (
                                <Radio
                                  key={storeAccount.id}
                                  value={storeAccount.account_number}
                                  onClick={() => {
                                    onSelectAccount(record, storeAccount);
                                  }}
                                >
                                  {makeAddress(storeAccount)}
                                </Radio>
                              ))}
                            </Space>
                          </Radio.Group>
                        </>
                      }
                    >
                      <span style={{ color: '#a1a2a6', cursor: 'pointer' }}>
                        {makeAddress(record.store_account[0])}
                      </span>
                    </Popover>
                  </TurtleBadge>
                );
              },
            },
            {
              width: 100,
              align: 'center',
              title: '',
              render: (_, record) => (
                <SelectButton
                  size="small"
                  onClick={() => {
                    onSelectWholesale(record);
                  }}
                >
                  {t('button.select')}
                </SelectButton>
              ),
            },
          ]}
        />
      </TurtleContentModal>
    </div>
  );
}

const tableTitle = css`
  font-weight: 400;
  color: #5b5d63;
`;

export default SearchWsStoreModal;
