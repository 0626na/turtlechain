import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import { useEffect, useState } from "react";
import { CreateOrderItem } from "apis/orderAPI";
import SearchProductModal from "./SearchProductModal";

const OrderCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order create")}`;

  const [form] = Form.useForm<CreateOrderItem>();
  const [list, setList] = useState<Array<CreateOrderItem>>([]);
  const [searchProductModalVisible, setSearchProductModalVisible] =
    useState<boolean>(false);

  // 주문 아이템 주문 미리보기에 추가
  const onCreate = (value: CreateOrderItem) => {
    setList([...list, { ...value }]);
    console.log(list);
  };

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
        breadcrumbList={[t("order management"), t("order create")]}
      />
      <Form layout="inline">
        <Form.Item label={t("mall")}>
          <StoreSelect emptyValueText={t("all")} width={200} />
        </Form.Item>
      </Form>
      <OrderCreateForm
        form={form}
        onCreate={onCreate}
        openModal={() => setSearchProductModalVisible(true)}
      />
      <OrderPreviewList list={list} setList={setList} />
      <SearchProductModal
        visible={searchProductModalVisible}
        form={form}
        onClose={() => {
          setSearchProductModalVisible(false);
        }}
      />
    </>
  );
};

export default OrderCreatePage;
