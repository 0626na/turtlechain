import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";
import OrderSearchFilter from "./OrderSearchFilter";
import OrderSheetList from "./OrderSheetList";
import { useState } from "react";
import OrderSheetDetails from "./OrderSheetDetails";

const OrderListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order list")}`;

  const [orderDetailVisible, setOrderDetailVisible] = useState<boolean>(false);

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/order.svg`}
            alt="order"
          />
        }
        title={orderDetailVisible ? t("order detail") : t("order list")}
        breadcrumbList={[t("order management"), t("order list")]}
      />
      {orderDetailVisible ? (
        <OrderSheetDetails
          onClose={() => {
            setOrderDetailVisible(false);
          }}
        />
      ) : (
        <>
          <OrderSearchFilter />
          <OrderSheetList
            openOrderDetail={() => {
              setOrderDetailVisible(true);
            }}
          />
        </>
      )}
    </>
  );
};

export default OrderListPage;
