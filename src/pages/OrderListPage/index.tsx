import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import OrderSheetList from "./OrderSheetList";
import { useState } from "react";
import Filter from "./Filter";
import OrderSheetItemModal from "./OrderSheetItemModal";

const OrderListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order.list")}`;

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.list")}
        breadcrumbList={[t("order.management"), t("order.list")]}
      />
      <Filter />
      <OrderSheetList openOrderDetail={openModal} />
      <OrderSheetItemModal visible={modalVisible} openModal={openModal} closeModal={closeModal} />
    </>
  );
};

export default OrderListPage;
