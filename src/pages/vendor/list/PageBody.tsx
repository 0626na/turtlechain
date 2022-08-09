import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
  FormOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  Col,
  Divider,
  Dropdown,
  Input,
  Menu,
  message,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Switch,
  Table,
} from 'antd';
import { useMutation, useQuery } from 'react-query';
import vendorAPI, {
  VendorShow,
  RequestGet,
  VendorAccount,
} from '@apis/vendorAPI';
import { storeState } from '@store/storeState';
import { phonePattern } from '@utils/pattern';
import {
  TurtleBadge,
  TurtleButtonSub,
  TurtleTableTitle,
} from '@components/common';
import { MainContent, MenuBar } from '@layout/page';
import { NewSearchFilter } from '@components/combine';
import UpdateModal from './UpdateModal';
import UpdateVendorNameModal from './UpdateVendorNameModal';

function PageBody() {
  const store = useRecoilValue(storeState);
  const [vendorList, setVendorList] = useState<Array<VendorShow>>();
  const [selectedRow, selectRow] = useState<VendorShow>();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateVendorNameModalVisible, setUpdateVendorNameModalVisible] =
    useState(false);

  // 거래처 목록 불러오기 query
  const [searchQuery, setSearchQuery] = useState<RequestGet>({
    page: 1,
    type: 'name',
    search_string: '',
    rt_store_id: -1,
  });

  // 거래처 목록 불러오기 요청
  const getListQuery = useQuery(
    ['getVendor', searchQuery], //
    () => vendorAPI.get({ ...searchQuery, rt_store_id: store.id ?? -1 }),
    {
      onSuccess: (data) => {
        setVendorList(
          data.data.vendor_list.map((vendor) => ({
            ...vendor,
            memo_active: !vendor.memo,
            memo_value: vendor.memo,
          })),
        );
      },
    },
  );

  // 거래처 부가세, 메모 수정 요청
  const updateQuery = useMutation(
    ['updateVendor'], //
    vendorAPI.update,
    {
      onSuccess: () => {
        message.success(t('message.success update'));
        getListQuery.refetch();
      },
    },
  );

  // 쇼핑몰 바뀔 때 거래처 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.id,
      page: 1,
    }));
  }, [store.id]);

  const changeMemoValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_value: e.currentTarget.value,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  const setMemoActive = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: true,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  const setMemoInactive = useCallback(
    (record: VendorShow) => {
      setVendorList(
        vendorList?.map((vendor) =>
          vendor.vendor_code === record.vendor_code
            ? {
                ...vendor,
                memo_active: false,
                memo_value: record.memo,
              }
            : vendor,
        ),
      );
    },
    [vendorList],
  );

  return (
    <>
      <MenuBar />
      <MainContent title={t('vendor.lists')}>
        <Table
          size="small"
          loading={getListQuery.isLoading}
          dataSource={vendorList}
          rowKey={(record) => record.vendor_code}
          pagination={false}
          scroll={{ y: 'auto' }}
          title={() => (
            <TurtleTableTitle count={getListQuery.data?.data.total_count ?? 0}>
              <NewSearchFilter
                vendor
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
          // 메모아이콘 클릭시 row확장 처리
          expandable={{
            columnWidth: 25,
            expandIcon: ({ onExpand, record }) => (
              <FileTextOutlined
                style={record.memo ? {} : { opacity: '0.4' }}
                onClick={(e) => {
                  return onExpand(record, e);
                }}
              />
            ),
            expandedRowRender: (record) => (
              <>
                {record.memo_active ? (
                  <>
                    <Input
                      value={record.memo_value}
                      onChange={(e) => {
                        changeMemoValue(e, record);
                      }}
                    />
                    <Row justify="end" gutter={4} style={{ marginTop: '8px' }}>
                      <Col>
                        {record.memo && (
                          <TurtleButtonSub
                            size="small"
                            color="grey"
                            onClick={() => {
                              setMemoInactive(record);
                            }}
                          >
                            취소
                          </TurtleButtonSub>
                        )}
                      </Col>
                      <Col>
                        <TurtleButtonSub
                          size="small"
                          onClick={() => {
                            updateQuery.mutate({
                              id: record.id,
                              memo: record.memo_value ?? '',
                              is_vat_included: record.is_vat_included,
                            });
                          }}
                        >
                          확인
                        </TurtleButtonSub>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <div>{record.memo} </div>
                    <Row justify="end" gutter={4} style={{ marginTop: '8px' }}>
                      <Col>
                        <TurtleButtonSub
                          size="small"
                          onClick={() => {
                            setMemoActive(record);
                          }}
                        >
                          수정
                        </TurtleButtonSub>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            ),
          }}
          columns={[
            {
              ellipsis: true,
              width: '10%',
              title: t('vendor.code'),
              render: (_, record) => record.vendor_code,
            },
            {
              ellipsis: true,
              title: t('vendor.name'),
              render: (_, record) =>
                record.vendor_name ?? record.ws_store_info.name,
            },
            {
              ellipsis: true,
              title: t('vendor.address'),
              render: (_, record) =>
                `${record.ws_store_info.building} ${record.ws_store_info.floor} ${record.ws_store_info.col} ${record.ws_store_info.loc} ${record.ws_store_info.ext}`,
            },
            {
              ellipsis: true,
              title: t('vendor.store phone'),
              render: (_, record) => {
                return (
                  <TurtleBadge count={record.ws_store_info.store_phone.length}>
                    <Popover
                      content={record.ws_store_info.store_phone.map(
                        ({ id, phone }) => (
                          <p key={id}>
                            {phone.replace(phonePattern, `$1-$2-$3`)}
                          </p>
                        ),
                      )}
                    >
                      {record.vendor_phone.phone.replace(
                        phonePattern,
                        `$1-$2-$3`,
                      )}
                    </Popover>
                  </TurtleBadge>
                );
              },
            },
            {
              ellipsis: true,
              title: t('vendor.account'),
              render: (_, record) => {
                const makeAccount = (account: VendorAccount) =>
                  `${account?.bank} ${account?.account_number} ${account?.account_holder}`;

                return makeAccount(record.vendor_account);
              },
            },
            {
              ellipsis: true,
              width: 120,
              title: t('vendor.include tax'),
              render: (_, record) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Popconfirm
                    title={t('description.update tax included')}
                    okText={t('yes')}
                    cancelText={t('no')}
                    onConfirm={() => {
                      updateQuery.mutate({
                        id: record.id,
                        memo: record.memo,
                        is_vat_included: !record.is_vat_included,
                      });
                    }}
                  >
                    <Switch
                      checkedChildren={t('button.include')}
                      checked={record.is_vat_included}
                      style={{ width: '52px' }}
                    />
                  </Popconfirm>
                </div>
              ),
            },
            // 메모 아이콘 위치 지정
            Table.EXPAND_COLUMN,
            {
              width: 25,
              render: (record) => (
                <Dropdown
                  overlay={
                    <Menu
                      style={{ width: 180 }}
                      items={[
                        {
                          key: '1',
                          label: (
                            <div
                              onClick={() => {
                                setUpdateVendorNameModalVisible(true);
                              }}
                            >
                              <FormOutlined />
                              거래처명 수정
                            </div>
                          ),
                        },
                        {
                          key: '2',
                          label: (
                            <div
                              onClick={() => {
                                selectRow(record);
                                setUpdateModalVisible(true);
                              }}
                            >
                              <ExclamationCircleFilled />
                              수정요청
                            </div>
                          ),
                        },
                        {
                          key: '3',
                          label: <Divider style={{ margin: 0 }}></Divider>,
                        },
                        {
                          key: '4',
                          label: (
                            <>
                              <DeleteOutlined />
                              삭제
                            </>
                          ),
                        },
                      ]}
                    />
                  }
                  placement="bottomLeft"
                  trigger={['click']}
                >
                  <MoreOutlined />
                </Dropdown>
              ),
            },
          ]}
        />

        {/*
         *  거래처명 수정 모달
         */}

        <UpdateVendorNameModal
          title="거래처명 수정"
          buttonTitle="저장"
          visible={updateVendorNameModalVisible}
          closeModal={() => {
            setUpdateVendorNameModalVisible(false);
          }}
          loading={false}
          onClickButton={(date) => {}}
        />

        {/*
         * 수정요청 모달
         */}

        <UpdateModal
          visible={updateModalVisible}
          closeModal={() => {
            setUpdateModalVisible(false);
          }}
          selectedRow={selectedRow}
        />
      </MainContent>
    </>
  );
}

export default PageBody;
