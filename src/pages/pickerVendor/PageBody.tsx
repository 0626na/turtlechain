import wholesalerAPI from '@apis/wholesalerAPI';
import { PageContent } from '@layout/page';
import { Table } from 'antd';
import { t } from 'i18next';
import React from 'react';
import { useQuery } from 'react-query';

function PageBody() {
  const getWholesalerStoreListQuery = useQuery(
    'getWholesalerStoreListQuery',
    wholesalerAPI.getList,
  );

  return (
    <>
      <PageContent>
        <Table
          loading={getWholesalerStoreListQuery.isLoading}
          dataSource={getWholesalerStoreListQuery.data?.data.store_list}
          size="small"
          scroll={{ y: 'auto', x: 1400 }}
          columns={[
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.mobile'),
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.accountInfo'),
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
