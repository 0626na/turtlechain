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
      dataSource={list}
      pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
      //loading={}
      rowKey={(record) => record.id!}
      style={{ height: "500px" }}
      columns={[
        {
          ellipsis: true,
          width: 100,
          align: "center",
          title: t("progress"),
          render: (_, record) => {
            const { is_cleared } = record;
            const color = is_cleared ? "green" : "red";
            const text = is_cleared ? t("confirmed") : t("waiting");
            return <Tag color={color}>{text}</Tag>;
          },
        },
        {
          ellipsis: true,
          width: 120,
          title: t("adjustment date"),
          render: (_, record) =>
            // moment(record.created_date).format("YYYY-MM-DD"),
            getLocalDateTimeString(record.created_date!),
        },
        {
          ellipsis: true,
          title: t("vendor.name"),
          render: (_, record) => record.vendor_info?.vendor_name,
        },
        {
          ellipsis: true,
          title: t("product.name"),
          render: (_, record) => record.product_info?.name,
        },
        {
          ellipsis: true,
          title: t("product.vendor product name"),
          render: (_, record) => record.product_info?.vendor_product_name,
        },
        {
          ellipsis: true,
          title: t("supply price"),
          render: (_, record) => record.price?.toLocaleString(),
        },
        {
          ellipsis: true,
          title: t("adjustment.type."),
          render: (_, record) => adjTypes[record.type!],
        },
        // {
        //   title: "",
        //   dataIndex: "action",
        //   render: (_, record) => {
        //     return (
        //       <>
        //         <Button //
        //           size="small"
        //           shape="round"
        //           onClick={() => {}}
        //         >
        //           {t("view details")}
        //         </Button>
        //         {!record.is_cleared && (
        //           <>
        //             <Popconfirm
        //               title={t("description.really delete")}
        //               okText={t("yes")}
        //               cancelText={t("no")}
        //               onConfirm={() => {
        //                 onDelete(record);
        //               }}
        //             >
        //               <Button
        //                 icon={<DeleteFilled />}
        //                 danger
        //                 type="primary"
        //                 size="small"
        //                 shape="round"
        //               >
        //                 {t("delete")}
        //               </Button>
        //             </Popconfirm>
        //             <Popconfirm
        //               title={t("description.really confirmed")}
        //               okText={t("yes")}
        //               cancelText={t("no")}
        //             >
        //               <Button //
        //                 icon={<CheckOutlined />}
        //                 type="primary"
        //                 size="small"
        //                 shape="round"
        //               >
        //                 {t("confirmed")}
        //               </Button>
        //             </Popconfirm>
        //           </>
        //         )}
        //       </>
        //     );
        //   },
        // },
      ]}
      title={() => (
        <b>
          {`${t("adjustment.list")}`}

          {`(${list.length.toLocaleString()})`}
        </b>
      )}
    />
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

export default AdjustmentList;
