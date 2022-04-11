import moment from "moment";
import { DatePicker, message, Row, Table, Tag } from "antd";
import { warehousingAPI } from "apis";
import { AdjustmentProduct } from "apis/adjustmentAPI";
import { RequestGetSheet, WarehousingItemShow } from "apis/warehousingAPI";
import { AxiosError } from "axios";
import { TurtleButton, TurtleModal, TurtleTableTitle } from "components/common";
import { t } from "i18next";
import { MainContent } from "layouts/main";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

interface Props {
  visible: boolean;
  closeModal: () => void;
  addProduct: (item: AdjustmentProduct) => boolean;
}

function LoadWarehousingModal({ visible, closeModal, addProduct }: Props) {
  const store = useRecoilValue(storeState);
  const [productList, setProductList] = useState<Array<WarehousingItemShow>>([]);
  const [selectedRows, selectRows] = useState<Array<WarehousingItemShow>>([]);
  const [sheetId, setSheetId] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: "",
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
    () => warehousingAPI.getItem({ sheet_id: sheetId }),
    {
      enabled: visible && sheetId !== -1,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setProductList(data.data.item_list);
      },
    },
  );

  // 상태 초기화
  const resetStates = useCallback(() => {
    setProductList([]);
    selectRows([]);
    setSheetId(-1);
    setSearchQuery({
      rt_store_id: store.id!,
      is_confirmed: "",
      start_date: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      page: 1,
    });
  }, [store.id]);

  // 모달열릴때 마다 상태 초기화
  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  // 상품 미리보기테이블에 추가
  const clickAddProduct = useCallback(() => {
    if (selectedRows.length === 0) {
      message.info("선택된 상품이 없습니다.");
      return;
    }

    // WarehousingProductShow -> AdjustmentProduct 타입 변환해서 넣어줌
    selectedRows.forEach((product) => {
      addProduct({
        vendor_id: product.vendor_info.id,
        vendor_name: product.vendor_info.vendor_name,
        vendor_address: product.vendor_info.vendor_address,
        warehousing_item_id: product.id,
        product_id: product.product_info.id,
        product_name: product.product_info.name,
        vendor_product_name: product.product_info.vendor_product_name,
        product_option: product.product_info.option,
        product_price: product.product_info.price,
        product_count: 0,
        product_count_max: product.count,
        product_code: product.product_info.product_code,
        is_vat_included: product.is_vat_included,
        type: "",
        memo: "",
      });
    });
    closeModal();
  }, [selectedRows, addProduct, closeModal]);

  return (
    <TurtleModal
      centered
      width="90%"
      title={t("warehousing.load")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: "93vh", overflowY: "auto" }}
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

      <MainContent title={t("warehousing.lists")}>
        <Table
          size="small"
          loading={getProductQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          dataSource={productList}
          rowKey={(record) => record.id}
          scroll={{ y: "auto" }}
          style={{ height: "60vh" }}
          title={() => (
            <TurtleTableTitle
              count={productList?.length ?? 0}
              selectedCount={selectedRows?.length ?? 0}
            />
          )}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[], selectedRows: WarehousingItemShow[]) => {
              selectRows(selectedRows);
            },
            checkStrictly: true,
          }}
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
              title: t("product.count"),
              render: (_, record) => record.count,
            },
          ]}
        />
      </MainContent>

      <Row justify="end">
        <TurtleButton type="default" onClick={clickAddProduct}>
          {t("button.add product")}
        </TurtleButton>
      </Row>
    </TurtleModal>
  );
}

export default LoadWarehousingModal;
