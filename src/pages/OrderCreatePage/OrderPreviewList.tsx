import {
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Upload,
} from "antd";
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
import { FileOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import excelAPI, { OrderProduct } from "apis/excelAPI";
import TurtleInfo from "../../components/common/TurtleInfo";

const OrderPreviewList = function () {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [itemList, setItemList] = useState<Array<OrderItemShow>>([]);
  const [allList, setAllList] = useState<Array<OrderProduct>>([]);
  const [successList, setSuccessList] = useState<Array<OrderProduct>>([]);
  const [failList, setFailList] = useState<Array<OrderProduct>>([]);
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

  const parseOrderQuery = useMutation("parseOrder", excelAPI.parseOrder, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      setAllList([...data.data.success, ...data.data.fail]);
      setSuccessList(data.data.success);
      setFailList(data.data.fail);
    },
  });

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id?.toString() ?? "");
    parseOrderQuery.mutate(form);
  };

  const resetField = useCallback(() => {
    setFileList([]);
    setAllList([]);
    setSuccessList([]);
    setFailList([]);
  }, []);

  const createOrderQuery = useMutation(
    "createOrder", //
    orderAPI.create,
    {
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
    },
  );

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

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Upload //
          maxCount={1}
          accept=".csv, .xls, .xlsx"
          beforeUpload={(file) => {
            if (!store.id) {
              message.warn(t("message.select store"));
              return false;
            }
            setFileList([file]);
            loadFile(file);
            return false;
          }}
          onRemove={() => {
            resetField();
            return false;
          }}
          fileList={fileList}
        >
          {t("button.upload excel")}
        </Upload>
      </Menu.Item>
      <Menu.Item key="2">{t("button.add single order")}</Menu.Item>
      <Menu.Item key="3">{t("button.load adjustment")}</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Toolbar>
        <TurtleButtonSub type="primary" color="skyblue">
          {t("button.connect external program")}
        </TurtleButtonSub>
        <Dropdown overlay={menu}>
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add order")}
          </Button>
        </Dropdown>
      </Toolbar>
      <Row>
        <TurtleText>
          {t("order.preview list")}
          <br />
          <TurtleInfo>
            붉은 색으로 표시된 "주문불가" 상품은 등록되지 않은 상품으로 오늘 주문에서 제외됩니다.
          </TurtleInfo>
        </TurtleText>
        <Table
          size="small"
          scroll={{ y: 800 }}
          loading={parseOrderQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          dataSource={successList}
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
