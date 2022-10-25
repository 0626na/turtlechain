import wholesalerAPI, { RequestGetList } from '@apis/wholesalerAPI';
import { SearchFilter } from '@components/combine';
import {
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import { PageContent } from '@layout/page';
import { phonePattern } from '@utils/pattern';
import { Col, Pagination, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

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
                        setSearchQuery({ ...searchQuery, search_type: value })
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
              width: '160px',
              title: t('table.vendorName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: '160px',
              title: t('table.vendorAddress'),
              render: (_, record) => {
                if (record.ext !== '') {
                  return record.ext;
                }
                return (
                  `${record.building} ${record.floor}층 ${record.col ?? ''} ${
                    record.lc ?? ''
                  }` ?? ''
                );
              },
            },

            {
              ellipsis: true,
              width: '160px',
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
              width: '260px',
              title: t('table.accountInfo'),
              render: (_, record) => {
                if (record.store_account.length !== 0)
                  return `${record.store_account[0].bank} ${record.store_account[0].account_number} ${record.store_account[0].account_holder}`;

                return '';
              },
            },
            {
              width: 70,
              align: 'center',
              title: t('table.memo'),
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
