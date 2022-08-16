import { t } from 'i18next';
import { Col, Pagination, Row, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import productAPI, { ProductShow, RequestGetList } from '@apis/productAPI';
import { storeState } from '@store/storeState';
import { FileTextOutlined } from '@ant-design/icons';
import { MainContent, MenuBar } from '@layout/page';
import { TurtleTableTitle } from '@components/common';
import { NewSearchFilter } from '@components/combine';
import UpdateProductModal from './UpdateProductModal';

function PageBody() {
  const store = useRecoilValue(storeState);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedRow, selectRow] = useState<ProductShow>();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    page: 1,
    search_string: '',
    type: 'name',
  });

  // 상품 리스트 불러오기 요청
  const getListQuery = useQuery(
    ['getProductList', searchQuery], //
    () => productAPI.getList({ ...searchQuery, rt_store_id: store.id ?? -1 }),
  );

  //리스트내 상품 삭제
  // const removeQuery = useMutation(productAPI.remove, {
  //   onSuccess: () => {
  //     getListQuery.refetch();
  //     message.success(`${t('message.success delete product')}`);
  //   },
  // });

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.id,
      page: 1,
    }));
  }, [store.id]);

  return (
    <>
      <MenuBar />

      <MainContent title={t('product.lists')}>
        <Table
          size="small"
          loading={getListQuery.isLoading}
          dataSource={getListQuery.data?.data.product_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: 'auto' }}
          title={() => (
            <TurtleTableTitle count={getListQuery.data?.data.total_count ?? 0}>
              <NewSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </TurtleTableTitle>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getListQuery.data?.data.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
          )}
          onRow={(record) => {
            return {
              onClick: (event) => {
                selectRow(record);
                setUpdateModalVisible(true);
              },
            };
          }}
          expandable={{
            expandedRowRender: (record) => <div>{record.memo}</div>,
            columnWidth: 25,
            expandIcon: ({ onExpand, record }) => {
              return (
                <Row justify="center">
                  <Col>
                    <FileTextOutlined
                      style={
                        record.memo ? {} : { opacity: '0.4', cursor: 'auto' }
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        record.memo && onExpand(record, e);
                      }}
                    />
                  </Col>
                  {/* <Col>
                    <DeleteOutlined
                      style={{ opacity: '0.4' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuery.mutate({
                          id: record.id,
                          is_inactive: true,
                        });
                      }}
                    />
                  </Col> */}
                </Row>
              );
            },
          }}
          columns={[
            {
              ellipsis: true,
              width: 90,
              title: t('vendor.code'),
              render: (_, record) => record.vendor_info.vendor_code,
            },
            {
              ellipsis: true,
              width: '8%',
              title: t('vendor.name'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              width: '10%',
              title: t('vendor.address'),
              render: (_, record) => record.vendor_info.vendor_address,
            },
            {
              ellipsis: true,
              title: t('product.name'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              title: t('product.vendor product name'),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              title: t('product.code'),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: '10%',
              title: t('product.option'),
              render: (_, record) => record.option,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('product.price'),
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              ellipsis: true,
              title: t('product.image url'),
              render: (_, record) => (
                <Typography.Link
                  href={record.image_url}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {record.image_url}
                </Typography.Link>
              ),
            },
            Table.EXPAND_COLUMN,
          ]}
        />

        {/* 상품 수정 모달 */}
        <UpdateProductModal
          visible={updateModalVisible}
          closeModal={() => {
            getListQuery.refetch();
            setUpdateModalVisible(false);
          }}
          selectedRow={selectedRow}
        />
      </MainContent>
    </>
  );
}

export default PageBody;
