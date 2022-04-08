import moment from "moment";
import { FileTextOutlined } from "@ant-design/icons";
import {
  Table,
  Tag,
  Row,
  Space,
  Divider,
  Select,
  DatePicker,
  Pagination,
  Input,
  Col,
  message,
  notification,
  Popconfirm,
  Form,
  InputNumber,
} from "antd";
import adjustmentAPI, { AdjustmentProductShow, RequestGetList } from "apis/adjustmentAPI";
import { useMutation, useQuery } from "react-query";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import { AxiosError } from "axios";
import {
  TurtleButtonSub,
  TurtleCard,
  TurtleIcon,
  TurtlePopConfirm,
  TurtleTableTitle,
} from "components/common";
import { MainContent, MenuBar } from "layouts/main";
import DetailModal from "./DetailModal";

const PageBody = function () {
  const store = useRecoilValue(storeState);
  const [adjustmentList, setAdjustmentList] = useState<Array<AdjustmentProductShow>>();
  const [selectedRow, selectRow] = useState<AdjustmentProductShow>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: store.id,
    is_cleared: 2,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page: 1,
  });

  // 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(
    ["getAdjustmentList", searchQuery],
    () => adjustmentAPI.getList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
      onSuccess: (data) => {
        setAdjustmentList(
          data.data.adjustment_list.map((product) => ({
            ...product,
            memo_active: !product.memo,
            memo_value: product.memo,
          })),
        );
      },
    },
  );

  // 매입조정 수정, 삭제 요청
  const updateAdjustmentQuery = useMutation("deleteAdjustment", adjustmentAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      notification.open({
        type: "success",
        message: data.is_inactive ? t("message.success delete") : t("message.success update"),
      });
      setSearchQuery({ ...searchQuery, page: 1 });
      getAdjustmentListQuery.refetch();
    },
  });

  // 쇼핑몰 바뀔때 마다 매입조정 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({ ...searchQuery, rt_store_id: store.id }));
  }, [store.id]);

  // 페이지 선택
  const selectPage = useCallback(
    (page) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  const openDetailModal = useCallback((adjustmentProduct) => {
    selectRow(adjustmentProduct);
    setDetailModalVisible(true);
  }, []);

  return (
    <>
      <MenuBar />

      <Row gutter={16}>
        <TurtleCard
          color="orange"
          title={t("adjustment.pending")}
          span={4}
          count={getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.count ?? 0}
          price={getAdjustmentListQuery.data?.data.adjustment_summary?.not_cleared.price ?? 0}
        />
        <TurtleCard
          color="geekblue"
          title={t("adjustment.confirmed")}
          span={4}
          count={getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.count ?? 0}
          price={getAdjustmentListQuery.data?.data.adjustment_summary?.cleared.price ?? 0}
        />
      </Row>

      <MainContent title={t("adjustment.lists")}>
        <Table
          size="small"
          dataSource={adjustmentList}
          loading={getAdjustmentListQuery.isLoading}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ y: "auto" }}
          onRow={(record) => ({
            onClick: () => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <TurtleTableTitle count={getAdjustmentListQuery.data?.data.total_count ?? 0}>
              {/* <SearchFilter type="product" onSearch={() => {}} /> */}

              <Divider type="vertical" style={{ margin: 0 }} />

              <Select
                size="small"
                style={{ width: 100 }}
                value={searchQuery.is_cleared}
                defaultValue={2}
                onChange={(is_cleared) => {
                  setSearchQuery({ ...searchQuery, is_cleared });
                }}
              >
                <Select.Option value={2}>{t("all")}</Select.Option>
                <Select.Option value={0}>{t("waiting")}</Select.Option>
                <Select.Option value={1}>{t("confirmed")}</Select.Option>
              </Select>

              <Divider type="vertical" style={{ margin: 0 }} />

              <DatePicker.RangePicker
                size="small"
                allowClear={false}
                value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
                onChange={(_, dateStrings) => {
                  const start_date = dateStrings[0];
                  const end_date = dateStrings[1];
                  setSearchQuery({ ...searchQuery, start_date, end_date });
                }}
              />
            </TurtleTableTitle>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getAdjustmentListQuery.data?.data.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={selectPage}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 100,
              align: "center",
              title: t("progress"),
              render: (_, record) => {
                const { is_cleared } = record;
                const color = is_cleared ? "geekblue" : "orange";
                const text = is_cleared ? t("confirmed") : t("waiting");
                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              ellipsis: true,
              align: "center",
              width: 120,
              title: t("adjustment date"),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              title: t("vendor.name"),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t("product.name"),
              render: (_, record) => record.product_info.name,
            },
            {
              ellipsis: true,
              title: t("product.vendor product name"),
              render: (_, record) => record.product_info.vendor_product_name,
            },
            {
              ellipsis: true,
              title: t("adjustment.is vat included"),
              render: (_, record) => (record.is_vat_included ? "포함" : "미포함"),
            },
            {
              ellipsis: true,
              title: t("adjustment.total price"),
              render: (_, record) => (record.price * record.count).toLocaleString(),
            },
            {
              ellipsis: true,
              title: t("adjustment.count all"),
              render: (_, record) => `${record.count - record.count_left} / ${record.count}`,
            },
            {
              ellipsis: true,
              title: t("adjustment.type."),
              render: (_, record) => t(`adjustment.type.${record.type}`),
            },
            {
              ellipsis: true,
              align: "center",
              width: 100,
              render: (_, record) =>
                record.count_left !== 0 && (
                  <TurtlePopConfirm
                    title={
                      <Form colon={false}>
                        <Form.Item label="처리방식">
                          <Select
                            size="small"
                            style={{ width: 100, marginLeft: 62 }}
                            value={record.adjustment_process_type}
                            onChange={(value) => {
                              setAdjustmentList(
                                adjustmentList?.map((product) =>
                                  product.id === record.id
                                    ? { ...product, adjustment_process_type: value }
                                    : product,
                                ),
                              );
                            }}
                          >
                            {["subtract", "refund"].map((value) => (
                              <Select.Option key={value} value={value}>
                                {t(`adjustment.process type.${value}`)}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item label="처리수량 / 남은수량">
                          <InputNumber
                            size="small"
                            style={{ width: 75 }}
                            min={1}
                            max={record.count_left}
                            value={record.process_count}
                            onChange={(value) => {
                              setAdjustmentList(
                                adjustmentList?.map((product) =>
                                  product.id === record.id
                                    ? { ...product, process_count: value }
                                    : product,
                                ),
                              );
                            }}
                          />
                          &nbsp;&nbsp;/&nbsp;{record.count_left}
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={(e) => {
                      if (!(record.process_count && record.adjustment_process_type)) {
                        message.warn("처리 방식, 수량을 입력해주세요.");
                        return;
                      }
                      updateAdjustmentQuery.mutate({
                        id: record.id,
                        adjustment_process_type: record.adjustment_process_type,
                        process_count: record.process_count,
                      });
                    }}
                  >
                    <TurtleButtonSub color="skyblue" size="small">
                      처리
                    </TurtleButtonSub>
                  </TurtlePopConfirm>
                ),
            },
            Table.EXPAND_COLUMN,
            {
              ellipsis: true,
              render: (_, record) => (
                <Space>
                  {record.count === record.count_left && (
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        updateAdjustmentQuery.mutate({
                          id: record.id,
                          is_inactive: 1,
                        });
                      }}
                    >
                      <TurtleIcon type="delete" />
                    </Popconfirm>
                  )}
                </Space>
              ),
            },
          ]}
          // 메모
          expandable={{
            expandedRowRender: (record) => (
              <>
                {record.memo_active ? (
                  <>
                    <Input
                      value={record.memo_value}
                      onChange={(e) => {
                        setAdjustmentList(
                          adjustmentList?.map((product) =>
                            product.id === record.id
                              ? { ...product, memo_value: e.currentTarget.value }
                              : product,
                          ),
                        );
                      }}
                    />
                    <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                      <Col>
                        {record.memo && (
                          <TurtleButtonSub
                            size="small"
                            color="grey"
                            onClick={() => {
                              setAdjustmentList(
                                adjustmentList?.map((product) =>
                                  product.id === record.id
                                    ? { ...product, memo_active: false }
                                    : product,
                                ),
                              );
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
                            updateAdjustmentQuery.mutate({
                              id: record.id,
                              memo: record.memo_value,
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
                    <Row justify="end" gutter={4} style={{ marginTop: "8px" }}>
                      <Col>
                        <TurtleButtonSub
                          size="small"
                          onClick={() => {
                            setAdjustmentList(
                              adjustmentList?.map((product) =>
                                product.id === record.id
                                  ? { ...product, memo_active: true }
                                  : product,
                              ),
                            );
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
            columnWidth: 25,
            expandIcon: ({ expanded, onExpand, record }) => {
              return (
                <FileTextOutlined
                  style={record.memo ? {} : { opacity: "0.4" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    return onExpand(record, e);
                  }}
                />
              );
            },
          }}
        />

        {/* 매입조정 상세보기 모달 */}
        <DetailModal
          visible={detailModalVisible}
          closeModal={() => {
            setDetailModalVisible(false);
          }}
          selectedRow={selectedRow}
        />
      </MainContent>
    </>
  );
};

export default PageBody;
