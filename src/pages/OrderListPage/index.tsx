import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import OrderSheetList from "./OrderSheetList";
import { useState } from "react";
import StoreFilter from "./StoreFilter";

const OrderListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order list")}`;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order list")}
        breadcrumbList={[t("order management"), t("order list")]}
      />
      <StoreFilter />
      <OrderSheetList
        openOrderDetail={() => {
          setModalVisible(true);
        }}
      />
    </>
  );
};

export default OrderListPage;
