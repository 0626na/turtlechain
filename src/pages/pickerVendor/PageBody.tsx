import wholesalerAPI from '@apis/wholesalerAPI';
import { PageContent } from '@layout/page';
import { Pagination, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

function PageBody() {
  const [page, setPage] = useState(1);
  const getWholesalerStoreListQuery = useQuery(
    ['getWholesalerStoreListQuery', page],
    () => wholesalerAPI.getList({ page, page_size: 10 }),
  );

  return (
    <>
      <PageContent>
        <Table
          size="small"
          scroll={{ y: 'auto', x: 1400 }}
          loading={getWholesalerStoreListQuery.isLoading}
          dataSource={getWholesalerStoreListQuery.data?.data.store_list}
          rowKey={(record) => record.id}
          pagination={false}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getWholesalerStoreListQuery.data?.data.total_count ?? 0}
                showSizeChanger={false}
                current={page}
                onChange={(page) => {
                  setPage(page);
                }}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              render: (_, record) =>
                `${record.building} ${record.floor} ${record.col ?? ''} ${
                  record.lc ?? ''
                }`,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.mobile'),
              render: (_, record) => {
                if (record.store_phone.length !== 0)
                  return record.store_phone[0].phone;

                return '';
              },
            },
            {
              ellipsis: true,
              width: 200,
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

export default PageBody;
