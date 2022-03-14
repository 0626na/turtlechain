import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm } from "antd";
import SimplePagination from "components/SimplePagination";
import { AdjustmentProduct } from "apis/adjustmentAPI";
import { getLocalDateTimeString } from "utils/general";

interface Props {
  isLoading: boolean;
  list: Array<AdjustmentProduct>;
  totalCount: number;
  currentPage: number;

  onSelectRow: (row: AdjustmentProduct) => void;
  onDelete: (row: AdjustmentProduct) => void;
  onConfirm: (row: AdjustmentProduct) => void;
}

const AdjustmentList = function ({
  isLoading,
  list,
  totalCount,
  currentPage,

  onSelectRow,
  onDelete,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  let adjTypes = {
    exchange: "교환",
    reserve: "미송",
    refund: "환불",
    takeback: "반품",
  };

  return (
    <Table
      size="small"
      scroll={{ x: "auto", y: 400 }}
      pagination={false}
      dataSource={list}
      columns={[
        {
          width: 100,
          align: "center",
          title: t("progress"),
          dataIndex: "is_confirmed",
          render: (_, record) => {
            const { is_cleared } = record;
            const color = is_cleared ? "green" : "red";
            const text = is_cleared ? t("confirmed") : t("waiting");
            return <Tag color={color}>{text}</Tag>;
          },
        },
        {
          width: 120,
          align: "center",
          title: t("adjustment date"),
          dataIndex: "created_time",
          render: (_, record) =>
            // moment(record.created_date).format("YYYY-MM-DD"),
            getLocalDateTimeString(record.created_date!),
        },
        {
          title: t("vendor.name"),
          dataIndex: "vendor_info.vendor_name",
          render: (_, record) => record.vendor_info?.vendor_name,
        },
        {
          title: t("product.name"),
          dataIndex: "product_info.product_name",
          render: (_, record) => record.product_info?.name,
        },
        {
          title: t("product.vendor_product_name"),
          dataIndex: "product_info.vendor_product_name",
          render: (_, record) => record.product_info?.vendor_product_name,
        },
        {
          align: "right",
          title: t("supply price"),
          dataIndex: "price",
          render: (_, record) => record.price!.toLocaleString(),
        },
        {
          width: 100,
          align: "center",
          title: t("adjustment.type.default"),
          dataIndex: "type",
          render: (_, record) => adjTypes[record.type!],
        },
        {
          width: 300,
          align: "center",
          title: "",
          dataIndex: "action",
          render: (_, record) => {
            return (
              <ActionContainer onClick={() => {}}>
                <Button //
                  size="small"
                  shape="round"
                  onClick={() => {}}
                >
                  {t("view details")}
                </Button>
                {!record.is_cleared && (
                  <>
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={() => {
                        onDelete(record);
                      }}
                    >
                      <Button
                        icon={<DeleteFilled />}
                        danger
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("delete")}
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title={t("description.really confirmed")}
                      okText={t("yes")}
                      cancelText={t("no")}
                    >
                      <Button //
                        icon={<CheckOutlined />}
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("confirmed")}
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </ActionContainer>
            );
          },
        },
      ]}
      title={() => (
        <b>
          {`${t("adjustment.list")}`}

          {`(${list.length.toLocaleString()})`}
        </b>
      )}
      footer={() => (
        <Footer>
          <SimplePagination />
        </Footer>
      )}
    />
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionContainer = styled.div`
  & > * + * {
    margin-left: 10px;
  }
`;

export default AdjustmentList;
