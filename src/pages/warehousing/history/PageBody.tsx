import React, { useEffect, useState } from 'react';
import warehousingAPI, { RequestGetSheet } from '@apis/warehousingAPI';
import {
  TurtlePrimaryRangePicker,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { Space, Table, Tag } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useQuery } from 'react-query';

function PageBody() {
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: '',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });

  // 입고장 리스트 요청
  const getWarehousingSheetQuery = useQuery(
    ['getWarehousingSheetQuery', searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: searchQuery.rt_store_id !== -1,
    },
  );

  // 쇼핑몰 바뀔때 마다 입고서 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id ?? -1,
    }));
  }, [store.selected]);

  return (
    <>
      <PageTitle title="입고서 리스트" />
      <PageContent>
        <Table
          size="small"
          loading={getWarehousingSheetQuery.isLoading}
          dataSource={getWarehousingSheetQuery.data?.sheet_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: 1400, y: 'auto' }}
          title={() => (
            <TurtleTableTitle
              totalCount={getWarehousingSheetQuery.data?.total_count ?? 0}
              rightContent={
                <Space>
                  <TurtleSearchSelect
                    // size="small"
                    // style={{ width: 100 }}
                    value={String(searchQuery.is_confirmed)}
                    onChange={(is_confirmed) => {
                      setSearchQuery({
                        ...searchQuery,
                        is_confirmed:
                          is_confirmed === '' ? '' : Number(is_confirmed),
                      });
                    }}
                    items={[
                      {
                        value: '',
                        name: t('warehousing.confirm.all'),
                      },
                      {
                        value: '0',
                        name: t('warehousing.confirm.false'),
                      },
                      {
                        value: '1',
                        name: t('warehousing.confirm.true'),
                      },
                    ]}
                  />

                  <TurtlePrimaryRangePicker
                    value={[
                      moment(searchQuery.start_date),
                      moment(searchQuery.end_date),
                    ]}
                    onChange={([start_date, end_date]) => {
                      setSearchQuery({ ...searchQuery, start_date, end_date });
                    }}
                  />
                </Space>
              }
            />
          )}
          columns={[
            {
              ellipsis: true,
              width: 200,
              align: 'center',
              title: t('table.progressStatus'),
              render: (_, { is_confirmed }) => (
                <Tag color={is_confirmed ? 'geekblue' : 'orange'}>
                  {t(`warehousing.confirm.${is_confirmed}`)}
                </Tag>
              ),
            },
            {
              ellipsis: true,
              width: 200,
              align: 'center',
              title: t('table.createdDate'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              width: 300,
              align: 'right',
              title: t('table.totalWarehousingCount'),
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              ellipsis: true,
              width: 300,
              align: 'right',
              title: t('table.totalAmount'),
              render: (_, record) => record.total_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'center',
              render: (_, record) => '',
              // <Space>
              //   {record.is_confirmed ? (
              //     // 16일 이전은 x
              //     moment(record.created_time) > moment('2022-08-17') && (
              //       /*
              //        * 진행상태 : 마감
              //        */
              //       <Popconfirm
              //         title={'마감을 취소하시겠습니까?'}
              //         okText={t('yes')}
              //         cancelText={t('no')}
              //         onConfirm={(e) => {
              //           e?.stopPropagation();
              //           updateSheetQuery.mutate({
              //             id: record.id,
              //             is_confirmed: false,
              //           });
              //         }}
              //         onCancel={(e) => {
              //           e?.stopPropagation();
              //         }}
              //       >
              //         <TurtleButtonSub
              //           color="red"
              //           size="small"
              //           onClick={(e) => {
              //             e.stopPropagation();
              //           }}
              //         >
              //           마감 취소
              //         </TurtleButtonSub>
              //       </Popconfirm>
              //     )
              //   ) : (
              //     /*
              //      * 진행상태 : 대기
              //      */
              //     <>
              //       <Popconfirm
              //         title={t('description.really confirmed')}
              //         okText={t('yes')}
              //         cancelText={t('no')}
              //         onConfirm={(e) => {
              //           e?.stopPropagation();
              //           updateSheetQuery.mutate({
              //             id: record.id,
              //             is_confirmed: true,
              //           });
              //         }}
              //         onCancel={(e) => {
              //           e?.stopPropagation();
              //         }}
              //       >
              //         <TurtleButtonSub
              //           size="small"
              //           onClick={(e) => {
              //             e.stopPropagation();
              //           }}
              //         >
              //           마감
              //         </TurtleButtonSub>
              //       </Popconfirm>
              //       <Popconfirm
              //         title={t('description.really delete')}
              //         okText={t('yes')}
              //         cancelText={t('no')}
              //         onConfirm={(e) => {
              //           e?.stopPropagation();
              //           updateSheetQuery.mutate({
              //             id: record.id,
              //             is_inactive: true,
              //           });
              //         }}
              //         onCancel={(e) => {
              //           e?.stopPropagation();
              //         }}
              //       >
              //         <TurtleIcon type="delete" />
              //       </Popconfirm>
              //     </>
              //   )}
              // </Space>
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
