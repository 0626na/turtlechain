import { t } from "i18next";
import { warehousingAPI } from "apis";
import { WarehousingItemShow, WarehousingSheet } from "apis/warehousingAPI";
import { TurtleModal, TurtleTableTitle } from "components/common";
import { useQuery } from "react-query";
import { Card, Col, Row, Statistic, Table } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  sheet?: WarehousingSheet;
  onOk: (itemList: WarehousingItemShow[]) => void;
}

function WarehousingDetailModal({ visible, onClose, sheet, onOk }: Props) {
  const getProductQuery = useQuery(
    ["getWarehousingItem"],
    () => warehousingAPI.getItem({ sheet_id: sheet?.id! }),
    {
      enabled: visible && !!sheet?.id,
    },
  );

  return (
    <TurtleModal
      centered
      width="90%"
      bodyStyle={{ height: "80vh", overflow: "auto" }}
      title="입고내역 확정하기"
      visible={visible}
      okText="확정하기"
      cancelText={t("button.cancel")}
      onCancel={onClose}
      onOk={() => {
        onOk(getProductQuery.data?.data.item_list ?? []);
      }}
    >
      <Row gutter={16}>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("warehousing.date")}
              value={sheet?.created_date}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("warehousing.total count")}
              value={`${sheet?.total_item_count}건`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("total supply price")}
              value={`${sheet?.total_price.toLocaleString()}원`}
            />
          </Card>
        </Col>
      </Row>

      <Table
        size="small"
        loading={getProductQuery.isLoading}
        pagination={false}
        dataSource={getProductQuery.data?.data.item_list}
        rowKey={(record) => record.id}
        style={{ height: "60vh", paddingTop: 30 }}
        title={() => <TurtleTableTitle count={getProductQuery.data?.data.item_list.length ?? 0} />}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => record.vendor_info.vendor_address,
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
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("warehousing.count"),
            render: (_, record) => record.count,
          },
        ]}
      />
    </TurtleModal>
  );
}

export default WarehousingDetailModal;
