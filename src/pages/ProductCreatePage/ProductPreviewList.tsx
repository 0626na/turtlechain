import {
  Button,
  Dropdown,
  InputNumber,
  Menu,
  message,
  notification,
  Popconfirm,
  Row,
  Table,
  Tabs,
  Upload,
} from "antd";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import Toolbar from "components/Toolbar";
import { FileOutlined, DeleteOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { excelAPI, productAPI } from "apis";
import { useCallback, useEffect, useState } from "react";
import { RcFile } from "antd/lib/upload";
import { Product } from "apis/excelAPI";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";
import { RequestCreateProduct } from "apis/productAPI";
import AddSingleProductModal from "./AddProductModal";
import TurtleInfo from "components/common/TurtleInfo";
import { pricePattern } from "utils/pattern";
import externalAPI from "apis/externalAPI";

function ProductPreviewList() {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [successList, setSuccessList] = useState<Array<Product>>([]);
  const [failList, setFailList] = useState<Array<Product>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  const parseProductQuery = useMutation("parseProduct", excelAPI.parseProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      message.info(`이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`);
      setSuccessList([
        ...data.data.success.map((product) => ({
          ...product,
          memo_value: product.memo,
          memo_active: !!product.memo,
        })),
        ...successList,
      ]);
      setFailList([...data.data.fail, ...failList]);
    },
  });

  const connectProductQuery = useMutation("connectProduct", externalAPI.connectSellmateProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      if (data.msg !== "success") {
        message.error(data.msg);
        resetField();
        return;
      }
      message.info(`이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`);
      setSuccessList([
        ...data.data.success.map((product) => ({
          ...product,
          memo_value: product.memo,
          memo_active: !!product.memo,
        })),
        ...successList,
      ]);
      setFailList([...data.data.fail, ...failList]);
    },
  });

  const createProductQuery = useMutation(
    ["createProduct"], //
    productAPI.createProduct,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: `성공적으로 등록하였습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
        });
        resetField();
      },
    },
  );

  const resetField = useCallback(() => {
    setSuccessList([]);
    setFailList([]);
    setFileList([]);
    connectProductQuery.reset();
  }, []);

  useEffect(() => {
    resetField();
  }, [store.id, resetField]);

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id?.toString() ?? "");
    parseProductQuery.mutate(form);
  };

  const addItem = useCallback(
    (item: Product) => {
      if (successList.find((product) => product.product_code === item.product_code)) {
        message.warn(t("message.already exist product"));
        return false;
      }
      setSuccessList([item, ...successList]);
      return true;
    },
    [successList],
  );

  const deleteItem = useCallback(
    (code) => {
      setSuccessList(successList?.filter((item) => item.product_code !== code));
    },
    [successList],
  );

  const onClickCreate = useCallback(() => {
    const resultList: Array<RequestCreateProduct> = [];
    successList?.forEach((product) => {
      resultList.push({
        ...product,
        rt_store_id: store.id ?? -1,
        vendor_id: parseInt(product.vendor_id),
        price: product.price,
      });
    });
    createProductQuery.mutate(resultList);
  }, [successList, store.id]);

  const onClickConnect = useCallback(() => {
    if (!store.id) {
      message.warn(t("message.select store"));
      return;
    }
    connectProductQuery.mutateAsync({ rt_store_id: store.id! });
  }, [store.id]);

  // 공급가 변경
  const setPrice = useCallback(
    (value, code) => {
      setSuccessList(
        successList.map((product) =>
          product.product_code === code ? { ...product, price: value } : product,
        ),
      );
    },
    [successList],
  );

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
      <Menu.Item
        key="2"
        onClick={() => {
          if (!store.id) {
            message.warn(t("message.select store"));
            return;
          }
          setAddProductModalVisible(true);
        }}
      >
        {t("button.add single product")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Toolbar isWarning>
        <TurtleButtonSub
          type="primary"
          color="skyblue"
          onClick={onClickConnect}
          disabled={connectProductQuery.isSuccess}
        >
          {t("button.connect external program")}
        </TurtleButtonSub>
        <Dropdown overlay={menu}>
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add product")}
          </Button>
        </Dropdown>
      </Toolbar>
      <Row style={{ paddingTop: 30, paddingBottom: 0 }}>
        <TurtleText>
          {`${t("product.preview list")}`}
          <br />
          <TurtleInfo>{t("description.fail product")}</TurtleInfo>
        </TurtleText>

        <Tabs defaultActiveKey="1" size="large" style={{ width: "100%" }}>
          <Tabs.TabPane tab={`성공(${successList.length})`} key="1">
            <Table
              size="small"
              loading={connectProductQuery.isLoading || parseProductQuery.isLoading}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              dataSource={successList}
              rowKey={(record) => record.product_code}
              scroll={{ y: "auto" }}
              columns={[
                {
                  ellipsis: true,
                  title: t("vendor.name"),
                  render: (_, record) => record.vendor_name,
                },
                {
                  ellipsis: true,
                  title: t("vendor.address"),
                  render: (_, record) => record.vendor_address,
                },
                {
                  ellipsis: true,
                  title: t("product.name"),
                  render: (_, record) => record.name,
                },
                {
                  ellipsis: true,
                  title: t("product.vendor product name"),
                  render: (_, record) => record.vendor_product_name,
                },
                {
                  ellipsis: true,
                  title: t("product.code"),
                  render: (_, record) => record.product_code,
                },
                {
                  ellipsis: true,
                  title: t("product.option"),
                  render: (_, record) => record.option,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("product.price"),
                  render: (_, record) => (
                    <InputNumber
                      size="small"
                      step={1000}
                      value={record.price}
                      formatter={(value) => `${value}`.replace(pricePattern, ",")}
                      min={0}
                      onChange={(value) => {
                        setPrice(value, record.product_code);
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  title: t("product.image url"),
                  render: (_, record) => record.image_url,
                },
                {
                  ellipsis: true,
                  title: t("product.memo"),
                  render: (_, record) => record.memo,
                },
                {
                  ellipsis: true,
                  width: "8%",
                  render: (_, record) => (
                    <DeleteOutlined //
                      style={{ cursor: "pointer", color: "#A1A2A6" }}
                      onClick={() => {
                        deleteItem(record.product_code);
                      }}
                    />
                  ),
                },
              ]}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`실패(${failList.length})`} key="2">
            <Table
              size="small"
              loading={connectProductQuery.isLoading || parseProductQuery.isLoading}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              dataSource={failList}
              rowKey={(record) => record.product_code}
              scroll={{ y: "auto" }}
              columns={[
                {
                  ellipsis: true,
                  title: t("vendor.name"),
                  render: (_, record) => record.vendor_name,
                },
                {
                  ellipsis: true,
                  title: t("vendor.address"),
                  render: (_, record) => record.vendor_address,
                },
                {
                  ellipsis: true,
                  title: t("product.name"),
                  render: (_, record) => <span style={{ color: "red" }}>{record.name}</span>,
                },
                {
                  ellipsis: true,
                  title: t("product.vendor product name"),
                  render: (_, record) => (
                    <span style={{ color: "red" }}>{record.vendor_product_name}</span>
                  ),
                },
                {
                  ellipsis: true,
                  title: t("product.code"),
                  render: (_, record) => record.product_code,
                },
                {
                  ellipsis: true,
                  title: t("product.option"),
                  render: (_, record) => record.option,
                },
                {
                  ellipsis: true,
                  title: t("product.price"),
                  render: (_, record) => record.price.toLocaleString(),
                },
                {
                  ellipsis: true,
                  title: t("product.image url"),
                  render: (_, record) => record.image_url,
                },
                {
                  ellipsis: true,
                  title: t("product.memo"),
                  render: (_, record) => record.memo,
                },
              ]}
            />
          </Tabs.TabPane>
        </Tabs>
      </Row>
      <Row justify="end">
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={onClickCreate}
        >
          <TurtleButton
            type="primary"
            disabled={successList.length === 0}
            loading={createProductQuery.isLoading}
          >
            {t("button.create product")}
          </TurtleButton>
        </Popconfirm>
      </Row>
      {/* 상품 단건 추가 모달 */}
      <AddSingleProductModal
        visible={addProductModalVisible}
        closeModal={() => {
          setAddProductModalVisible(false);
        }}
        addProduct={addItem}
      />
    </>
  );
}

export default ProductPreviewList;
