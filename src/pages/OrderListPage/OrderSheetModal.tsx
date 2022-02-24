import { Button, Card, Col, Input, Modal, Row, Table, Typography } from "antd";
import { t } from "i18next";
import { useQuery } from "react-query";
import { orderAPI } from "apis";
import { phonePattern } from "utils/pattern";
import SearchFilter from "components/SearchFilter";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useMemo } from "react";

interface Props {
  visible: boolean;
  closeModal: () => void;
  sheetId?: number;
}

const OrderSheetItemModal = function ({ visible, closeModal, sheetId }: Props) {
  const store = useRecoilValue(storeState);

  const makeOrderType = (type: string) => {
    if (type === "extra") return "기타";
    if (type === "reserve") return "미송";
    if (type === "takeback") return "반품";
    if (type === "exchange") return "교환";
    if (type === "sample") return "샘플";
    if (type === "pickup") return "픽업";
    return "주문";
  };

  const getOrderQuery = useQuery(
    ["getOrder", sheetId],
    () => orderAPI.get({ order_sheet_id: sheetId ?? -1 }),
    {
      enabled: !!sheetId,
    },
  );

  const getOrderItemQuery = useQuery(
    ["getOrderItem", sheetId],
    () => orderAPI.getItem({ sheet_id: sheetId ?? -1 }),
    {
      enabled: !!sheetId,
    },
  );

  const sheetInfo = useMemo(() => getOrderQuery.data?.data, [getOrderQuery.data?.data]);

  return (
    <Modal
      centered
      width="90%"
      maskClosable={false}
      title={`(${store.name}) ${t("order.detail")}`}
      footer={false}
      visible={visible}
      onOk={closeModal}
      onCancel={closeModal}
    >
      <Table // 상단 주문서 정보 테이블
        size="small"
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        loading={getOrderQuery.isLoading}
        dataSource={[{ ...getOrderQuery.data?.data }]}
        rowKey={(record) => 1}
        columns={[
          {
            ellipsis: true,
            title: "주문 날짜",
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: "총 거래처 수",
            render: (_, record) => 125,
          },
          {
            ellipsis: true,
            title: "총 상품 수",
            render: () => 240,
          },
          {
            ellipsis: true,
            title: "총 주문 공급가액",
            render: () => "8,000,000",
          },
        ]}
      />
      <Row style={{ padding: "1rem 0" }}>
        <SearchFilter type="product" onSearch={() => {}} />
      </Row>
      <Row style={{ paddingBottom: "1rem" }} gutter={16} justify="space-between">
        <Col span={3}>
          <Card size="small" title={<div>주문</div>} style={{ textAlign: "center" }}>
            <div>{sheetInfo?.order_count} 건</div>
            <div>{sheetInfo?.order_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="미송" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.reserve_count} 건</div>
            <div>{sheetInfo?.reserve_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="반품" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.takeback_count} 건</div>
            <div>{sheetInfo?.takeback_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="교환" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.exchange_count} 건</div>
            <div>{sheetInfo?.exchange_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="샘플" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.sample_count} 건</div>
            <div>{sheetInfo?.sample_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="픽업" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.pickup_count} 건</div>
            <div>{sheetInfo?.pickup_price.toLocaleString()} 원</div>
          </Card>
        </Col>
        <Col span={3}>
          <Card size="small" title="기타" style={{ textAlign: "center" }}>
            <div>{sheetInfo?.extra_count} 건</div>
            <div>{sheetInfo?.extra_price.toLocaleString()} 원</div>
          </Card>
        </Col>
      </Row>
      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        loading={getOrderItemQuery.isLoading}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        dataSource={getOrderItemQuery.data?.data.order_item_list}
        rowKey={(record) => record.id}
        columns={[
          {
            ellipsis: true,
            title: "거래처명",
            render: (_, record) => record.product_info.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: "거래처 주소",
            render: (_, record) => record.product_info.vendor_info.vendor_address,
          },
          {
            ellipsis: true,
            title: t("phone"),
            render: (_, record) =>
              record.product_info.vendor_info.vendor_phone.phone.replace(phonePattern, `$1-$2-$3`),
          },
          {
            ellipsis: true,
            title: t("product.code"),
            render: (_, record) => record.product_info.product_code,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: "거래처 상품명",
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("option"),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: "발주수량",
            render: (_, record) => record.count,
          },
          {
            ellipsis: true,
            title: "공급가",
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: "주문종류",
            render: (_, record) => makeOrderType(record.type),
          },
          {
            ellipsis: true,
            title: "메모",
            render: (_, record) => record.memo,
          },
        ]}
      />
    </Modal>
  );
};

export default OrderSheetItemModal;
