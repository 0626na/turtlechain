import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import { useEffect, useState } from "react";
import { CreateOrderItem } from "apis/orderAPI";
import SearchProductModal from "./SearchProductModal";
import StoreFilter from "./StoreFilter";

const OrderCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order create")}`;

  const [form] = Form.useForm<CreateOrderItem>();
  const [list, setList] = useState<Array<CreateOrderItem>>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 주문 아이템 주문 미리보기에 추가
  const onCreate = (value: CreateOrderItem) => {
    setList([...list, { ...value }]);
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order create")}
        breadcrumbList={[t("order management"), t("order create")]}
      />
      <StoreFilter />
      <OrderCreateForm form={form} onCreate={onCreate} openModal={() => setModalVisible(true)} />
      <OrderPreviewList list={list} setList={setList} />
      <SearchProductModal
        visible={modalVisible}
        form={form}
        onClose={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
};

export default OrderCreatePage;
