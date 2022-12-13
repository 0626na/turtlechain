import vendorAPI, {
  VendorAccount,
  VendorPhone,
  Wholesale,
} from '@apis/vendorAPI';
import wholesalerAPI, {
  RequestGetList,
  WholesalerStore,
} from '@apis/wholesalerAPI';
import { SearchFilter } from '@components/combine';
import InputModal from '@components/combine/modal/InputModal';
import {
  MemoIcon,
  TurtleDropdown,
  TurtleIcon,
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { PageContent } from '@layout/page';
import VendorInfoUpdateModal from '@pages/vendor/history/modal/VendorInfoUpdateModal';
import { phonePattern } from '@utils/pattern';
import { Col, Pagination, Row, Table } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import OrderVendorInfoUpdateModal from './modals/OrderVendorInfoUpdateModal';

const options = [
  {
    name: t('table.retailerStoreName'),
    value: 'store_name',
  },
  {
    name: t('table.mobile'),
    value: 'mobile',
  },
  {
    name: t('accountNumber'),
    value: 'account_number',
  },
  {
    name: t('accountHolder'),
    value: 'account_holder',
  },
];

export interface OrderVendor {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_address: string;
  is_vat_included: boolean;
  memo: string;
  vendor_phone: VendorPhone;
  vendor_account: VendorAccount;
  ws_store_info: Wholesale;
  memo_active?: boolean;
  memo_value?: string;
}

function PageBody() {
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    search_string: '',
    page: 1,
    page_size: 17,
  });
  const [
    vendorUpdateModalVisible,
    vendorUpdateModalOpen,
    vendorUpdateModalClose,
  ] = useModal();
  const [selectedRow, setSelectedRow] = useState<WholesalerStore>();
  const getWholesalerStoreListQuery = useQuery(
    [
      'getWholesalerStoreListQuery',
      searchQuery.page,
      searchQuery.search_string,
    ],
    () => wholesalerAPI.getList(searchQuery),
  );

  const filterdList = useMemo(
    () =>
      getWholesalerStoreListQuery.data?.data.store_list.filter((store) => {
        return (
          store.name.includes(searchQuery.search_string) ||
          store.building.includes(searchQuery.search_string) ||
          store.floor.includes(searchQuery.search_string) ||
          store.col.includes(searchQuery.search_string) ||
          store.loc.includes(searchQuery.search_string) ||
          store.ext.includes(searchQuery.search_string) ||
          store.store_phone[0].phone.includes(searchQuery.search_string) ||
          store.store_account[0].account_number.includes(
            searchQuery.search_string,
          )
        );
      }),
    [getWholesalerStoreListQuery, searchQuery],
  );

  return (
    <>
      <OrderVendorInfoUpdateModal
        selectedRow={selectedRow as WholesalerStore}
        visible={vendorUpdateModalVisible}
        closeModal={vendorUpdateModalClose}
      />
      <PageContent>
        <Table
          size="small"
          scroll={{ y: 'auto', x: 950 }}
          loading={getWholesalerStoreListQuery.isLoading}
          dataSource={filterdList ?? []}
          pagination={false}
          rowKey={(record) => record.id}
          title={() => (
            <TurtleTableTitle
              totalCount={
                getWholesalerStoreListQuery.data?.data.total_count ?? 0
              }
              rightContent={
                <Row>
                  <Col>
                    <TurtleSearchInput
                      placeholder={t(
                        'please input vendor name, mobile, account number, account holder',
                      )}
                      onSearch={(value) =>
                        setSearchQuery({
                          ...searchQuery,
                          search_string: value,
                          page: 1,
                        })
                      }
                    />
                  </Col>
                </Row>
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getWholesalerStoreListQuery.data?.data.total_count ?? 0}
                showSizeChanger={false}
                pageSize={searchQuery.page_size}
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
              title: t('table.vendorName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              title: t('table.vendorAddress'),
              render: (_, record) => {
                if (record.ext !== '') {
                  return record.ext;
                }
                return (
                  `${record.building} ${record.floor}층 ${record.col ?? ''} ${
                    record.loc ?? ''
                  }` ?? ''
                );
              },
            },

            {
              ellipsis: true,
              title: t('table.mobile'),
              render: (_, record) => {
                if (record.store_phone.length !== 0) {
                  return record.store_phone[0].phone.replace(
                    phonePattern,
                    '$1-$2-$3',
                  );
                }

                return '';
              },
            },
            {
              ellipsis: true,
              title: t('table.accountInfo'),
              render: (_, record) => {
                if (record.store_account.length !== 0)
                  return `${record.store_account[0].bank} ${record.store_account[0].account_number} ${record.store_account[0].account_holder}`;

                return '';
              },
            },
            {
              title: '',
              align: 'right',
              width: 30,
              render: (_, record) => (
                <TurtleDropdown
                  items={[
                    {
                      key: '1',
                      label: t('request info modify'),
                      icon: <TurtleIcon name="updateVendorInfo" />,
                      onClick: (e) => {
                        setSelectedRow(record);
                        vendorUpdateModalOpen();
                      },
                    },
                    {
                      key: '2',
                      type: 'divider',
                    },
                    {
                      key: '3',
                      label: (
                        <span
                          css={css`
                            color: red;
                          `}
                        >
                          삭제
                        </span>
                      ),
                      icon: <TurtleIcon name="delete" danger />,
                    },
                  ]}
                  triggerButton={<TurtleIcon name="more" />}
                />
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

const marginRight = css`
  margin-right: 6px;
`;
export default PageBody;
