import { Button, Col, message, notification, Popconfirm, Row, Space, Table } from "antd";
import orderAPI, { OrderItemShow } from "apis/orderAPI";
import TurtleText from "components/common/TurtleText";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import moment from "moment";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import Toolbar from "components/Toolbar";
import CreateBulkOrderModal from "./CreateBulkOrderModal";
import OrderCreateForm from "./OrderCreateForm";

const OrderPreviewList = function () {
  const store = useRecoilValue(storeState);
  const [itemList, setItemList] = useState<Array<OrderItemShow>>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const makeType = (type: string) => {
    if (type === "extra") return "기타";
    if (type === "reserve") return "미송";
    if (type === "takeback") return "반품";
    if (type === "exchange") return "교환";
    if (type === "sample") return "샘플";
    if (type === "pickup") return "픽업";
    return "주문";
  };

  const createOrderQuery = useMutation("createOrder", orderAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      notification.open({
        type: "success",
        message: `성공적으로 등록하였습니다.`,
      });
      resetItemList();
    },
  });

  const addItem = useCallback((item: OrderItemShow) => {
    setItemList((itemList) => [...itemList, item]);
  }, []);

  const deleteItem = useCallback(
    (id) => {
      setItemList(itemList.filter((item) => item.product_id !== id));
    },
    [itemList],
  );

  const resetItemList = useCallback(() => {
    setItemList([]);
  }, []);

  useEffect(() => {
    resetItemList();
  }, [store.id, resetItemList]);

  const onClickCreate = useCallback(() => {
    if (!store.id) return;
    createOrderQuery.mutate({
      sheet: {
        created_date: moment().format("YYYY-MM-DD"),
        rt_store_id: store.id,
        status: "N",
        type: "new",
      },
      item: {
        rt_store_id: store.id,
        item_list: itemList.map((item) => ({
          vendor_id: item.vendor_id,
          product_id: item.product_id,
          count: item.count,
          price: item.price,
          // TODO : type 받아와서 넣어야 함 (excel 파싱 이후)
          type: "order",
          image_url: item.image_url,
          memo: item.memo,
        })),
      },
    });
  }, [itemList, store.id]);

  return (
    <>
      <Toolbar>
        <TurtleButtonSub
          icon="file"
          onClick={() => {
            if (!store.id) {
              message.warn("쇼핑몰을 선택해주세요.");
              return;
            }
            setCreateModalVisible(true);
          }}
        >
          {t("button.upload order sheet")}
        </TurtleButtonSub>
        {/* <TurtleButtonSub icon="download">{t("button.load adjustment")}</TurtleButtonSub> */}
      </Toolbar>
      <Row>
        <TurtleText>{t("order.preview list")}</TurtleText>
        <Table
          size="small"
          scroll={{ y: 800 }}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          dataSource={itemList}
          rowKey={(record) => record.product_id}
          style={{ height: "510px" }}
          columns={[
            {
              ellipsis: true,
              title: t("vendor.name"),
              dataIndex: "vendor_name",
            },
            {
              ellipsis: true,
              title: t("vendor.address"),
              dataIndex: "vendor_address",
            },
            {
              ellipsis: true,
              title: t("vendor.store phone"),
              dataIndex: "vendor_phone",
            },
            {
              ellipsis: true,
              title: t("product.code"),
              dataIndex: "product_code",
            },
            {
              ellipsis: true,
              title: t("product.name"),
              dataIndex: "product_name",
            },
            {
              ellipsis: true,
              title: t("product.option"),
              dataIndex: "product_option",
            },
            {
              ellipsis: true,
              title: t("product.count"),
              dataIndex: "count",
            },
            {
              ellipsis: true,
              title: t("product.price"),
              dataIndex: "price",
            },
            {
              ellipsis: true,
              title: t("order.type."),
              dataIndex: "type",
              render: (_, record) => makeType(record.type),
            },
            {
              title: t("order.memo"),
              dataIndex: "memo",
            },
            {
              width: 100,
              align: "center",
              title: "",
              dataIndex: "action",
              render: (_, record) => (
                <TurtleButtonSub //
                  size="small"
                  color="red"
                  onClick={() => {
                    deleteItem(record.product_id);
                  }}
                >
                  {t("button.delete")}
                </TurtleButtonSub>
              ),
            },
          ]}
        />
      </Row>
      <Row justify="end" style={{ paddingTop: "1rem" }}>
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={onClickCreate}
        >
          <TurtleButton // 주문 등록 Button
            disabled={itemList.length === 0}
            loading={createOrderQuery.isLoading}
          >
            {t("order.create")}
          </TurtleButton>
        </Popconfirm>
      </Row>
      {/* <OrderCreateForm addItem={addItem} /> */}
      <CreateBulkOrderModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
        addItem={addItem}
      />
    </>
  );
};

export default OrderPreviewList;
