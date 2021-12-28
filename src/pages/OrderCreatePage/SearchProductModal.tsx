import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import warehousingAPI, { SheetItem } from "apis/warehousingAPI";
import { DeleteFilled, SyncOutlined } from "@ant-design/icons";
import { Modal, Form, Table, Input } from "antd";
import { responseGetProduct } from "apis/orderAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SearchProductModal = function ({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState<string>("");
  const [productList, setProductList] = useState<Array<any>>([]);

  const searchProduct = (e: any) => {
    setSearchText(e.target.value);
    createBulkProduct();
  };

  const createBulkProduct = () => {
    const newProductList: Array<responseGetProduct> = [
      {
        product_code: 1121111,
        product_name: "상품1",
        option: "옵션1",
        supply_price: 50000,
      },
      {
        product_code: 21231231,
        product_name: "상품2",
        option: "옵션2",
        supply_price: 30000,
      },
      {
        product_code: 3333333,
        product_name: "상품3",
        option: "옵션3",
        supply_price: 20000,
      },
    ];
    setProductList([...productList, ...newProductList]);
    console.log(productList);
  };

  return (
    <Modal //
      centered
      width="40%"
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        onClose();
        /*
        if (isUpdated) {
          confirmClose();
        } else {
          onClose();
        }
        */
      }}
      title={`${t("product")} ${t("search")}`}
      footer={false}
    >
      <ModalInner>
        <Form layout="inline">
          <Form.Item>
            <Input
              value={searchText}
              placeholder={t("search text")}
              onChange={(e) => {
                console.log("hi");
                searchProduct(e);
              }}
            />
          </Form.Item>
        </Form>
        <Table
          size="small"
          //loading={getSheetItemQuery.isLoading}
          pagination={false}
          dataSource={productList}
          rowKey={(record) => record.product_code}
          columns={[
            {
              title: t("product code"),
              dataIndex: "product_code",
            },
            {
              title: t("product name"),
              dataIndex: "product_name",
            },
            {
              title: t("option"),
              dataIndex: "option",
            },
            {
              title: t("supply price"),
              dataIndex: "supply_price",
            },
          ]}
        />
      </ModalInner>
    </Modal>
  );
};

const ModalInner = styled.div`
  height: 70vh;
  overflow: auto;
  & > * + * {
    margin-top: 20px;
  }
`;

export default SearchProductModal;
