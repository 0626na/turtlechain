import { DatePicker, message, Row, Table, Tag } from "antd";
import { warehousingAPI } from "apis";
import { RequestGetSheet, WarehousingProductShow } from "apis/warehousingAPI";
import { AxiosError } from "axios";
import TurtleModal from "components/common/TurtleModal";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function LoadWarehousingModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const [productList, setProductList] = useState<Array<WarehousingProductShow>>([]);
  const [sheetId, setSheetId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    // is_confirmed : 0 => 마감 전
    is_confirmed: 0,
    start_date: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page: 1,
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ["getWarehousingSheet", searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: visible && !!store.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {},
    },
  );

  // 입고장 상세내역 리스트 요청
  const getProductQuery = useQuery(
    ["getWarehousingProduct", sheetId],
    () => warehousingAPI.getProduct({ sheet_id: sheetId! }),
    {
      enabled: visible && !!sheetId,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setProductList(data.data.item_list);
      },
    },
  );

  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: store.id ?? -1 });
  }, [store.id]);

  return (
    <TurtleModal
      centered
      width="90%"
      title={t("warehousing.load")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
    >
      <Row style={{ marginBottom: 16 }}>
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
      </Row>

      <Table
        size="small"
        dataSource={getSheetQuery.data?.sheet_list}
        loading={getSheetQuery.isLoading}
        pagination={false}
        scroll={{ y: "auto" }}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => {
            setSheetId(record.id);
          },
        })}
        columns={[
          {
            ellipsis: true,
            width: 100,
            align: "center",
            title: t("progress"),
            render: (_, record) => {
              const { is_confirmed } = record;
              const color = is_confirmed ? "geekblue" : "orange";
              const text = is_confirmed ? t("confirmed") : t("waiting");
              return <Tag color={color}>{text}</Tag>;
            },
          },
          {
            ellipsis: true,
            align: "center",
            title: t("warehousing.date"),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            align: "center",
            title: t("warehousing.total count"),
            render: (_, record) => record.total_item_count.toLocaleString(),
          },
          {
            ellipsis: true,
            align: "center",
            title: t("total supply price"),
            render: (_, record) => record.total_price.toLocaleString(),
          },
        ]}
      />

      <Row style={{ margin: "16px 0" }}>
        <TurtleText>{t("warehousing.lists")}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getProductQuery.isLoading}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        dataSource={productList}
        rowKey={(record) => record.id}
        scroll={{ y: "auto" }}
        style={{ height: "60vh" }}
        title={() => (
          <Row justify="space-between">
            <span>
              총 <span style={{ color: "#32ACDD" }}>{productList.length ?? 0}</span>건
            </span>
          </Row>
        )}
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
        ]}
      />
    </TurtleModal>
  );
}

export default LoadWarehousingModal;
