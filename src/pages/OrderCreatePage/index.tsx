import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import PageHeader from "components/PageHeader";
import OrderCreateForm from "./OrderCreateForm";
import OrderPreviewList from "./OrderPreviewList";
import { useEffect, useState } from "react";
import { CreateOrderItem } from "apis/orderAPI";
import Filter from "./Filter";

const OrderCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("order.create")}`;

  const [storeId, setStoreId] = useState();
  const [form] = Form.useForm<CreateOrderItem>();
  const [list, setList] = useState<Array<CreateOrderItem>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  let fakeCode = 11111;

  // 주문 아이템 주문 미리보기에 추가
  const onCreate = (value: CreateOrderItem) => {
    setList([...list, { ...value }]);
  };

  // fake 주문 아이템
  const fakeOrderItem: CreateOrderItem = {
    vendor_name: "테스트 거래처",
    vendor_address: "테스트 주소",
    vendor_phone: "테스트 번호",
    product_code: 111111,
    product_name: "테스트 상품명",
    product_option: "테스트 옵션",
    product_price: 10000,
    product_count: 10,
    order_type: "order",
    order_memo: "테스트 메모",
  };

  // fake 주문 아이템 리스트 생성
  const makeFakeOrderItem = () => {
    const changedList: Array<CreateOrderItem> = [];
    for (let i = 0; i < 5; i++) {
      changedList.push({ ...fakeOrderItem, product_code: fakeCode++ });
    }
    setList(changedList);
  };

  useEffect(() => {
    makeFakeOrderItem();
  }, []);

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="order"
        title={t("order.create")}
        breadcrumbList={[t("order.management"), t("order.create")]}
      />
      <Filter />
      <OrderCreateForm form={form} onCreate={onCreate} />
      <OrderPreviewList list={list} setList={setList} />
    </>
  );
};

export default OrderCreatePage;
