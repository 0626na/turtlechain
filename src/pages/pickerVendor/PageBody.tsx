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

const options = [
  {
    name: '거래처명',
    value: 'store_name',
  },
  {
    name: '휴대전화 번호',
    value: 'mobile',
  },
  {
    name: '계좌번호',
    value: 'account_number',
  },
  {
    name: '예금주',
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
    search_type: 'store_name',
    search_string: '',
    page: 1,
    page_size: 10,
  });
  const getWholesalerStoreListQuery = useQuery(
    [
      'getWholesalerStoreListQuery',
      searchQuery.page,
      searchQuery.search_string,
    ],
    () => wholesalerAPI.getList(searchQuery),
  );

  return (
    <>
      <PageContent>
        <Table
          size="small"
          scroll={{ y: 648, x: 1608 }}
          loading={getWholesalerStoreListQuery.isLoading}
          dataSource={getWholesalerStoreListQuery.data?.data.store_list ?? []}
          rowKey={(record) => record.id}
          pagination={false}
          title={() => (
            <TurtleTableTitle
              totalCount={
                getWholesalerStoreListQuery.data?.data.total_count ?? 0
              }
              rightContent={
                <Row>
                  <Col css={marginRight}>
                    <TurtleSearchSelect
                      items={options}
                      value={searchQuery.search_type}
                      onChange={(value) =>
                        setSearchQuery({
                          ...searchQuery,
                          search_type: String(value),
                        })
                      }
                    />
                  </Col>
                  <Col>
                    <TurtleSearchInput
                      placeholder="검색어를 입력해주세요"
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
                current={searchQuery.page}
                pageSize={10}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 176,
              title: t('table.vendorName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: 176,
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
              width: 176,
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
              width: 176,
              title: t('table.accountInfo'),
              render: (_, record) => {
                if (record.store_account.length !== 0)
                  return `${record.store_account[0].bank} ${record.store_account[0].account_number} ${record.store_account[0].account_holder}`;

                return '';
              },
            },
            {
              width: 20,

              title: '',
              align: 'right',
              render: (_, record) => (
                <TurtleDropdown
                  items={[
                    {
                      key: '1',
                      label: '거래처명 수정',
                      icon: <TurtleIcon name="updateVendorName" />,
                    },
                    {
                      key: '2',
                      label: '정보수정 요청',
                      icon: <TurtleIcon name="updateVendorInfo" />,
                      onClick: (e) => {},
                    },
                    {
                      key: '3',
                      type: 'divider',
                    },
                    {
                      key: '4',
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
