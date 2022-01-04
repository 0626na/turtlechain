import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Table, Input } from "antd";
import { responseGetProduct } from "apis/orderAPI";

interface Props {
  visible: boolean;
  form: any;
  onClose: () => void;
}

const SearchProductModal = function ({ visible, form, onClose }: Props) {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [productList, setProductList] = useState<Array<responseGetProduct>>([]);

  // 상품명 또는 상품번호 검색
  const searchProduct = (e: any) => {
    setSearchText(e.target.value);
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
