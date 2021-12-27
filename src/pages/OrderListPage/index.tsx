import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";

const OrderListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order list")}`;
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
        title={t("order create")}
        breadcrumbList={[t("order management"), t("order list")]}
      />
      <Form>
        <StoreSelect
          width={200}
          emptyValueText={`${t("mall")} ${t("select")}`}
        />
      </Form>
    </>
  );
};

export default OrderListPage;
