import {
  Button,
  Dropdown,
  Menu,
  message,
  notification,
  Popconfirm,
  Row,
  Table,
  Upload,
} from "antd";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import Toolbar from "components/Toolbar";
import { FileOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { excelAPI, productAPI } from "apis";
import { useCallback, useEffect, useState } from "react";
import { RcFile } from "antd/lib/upload";
import { Product, ProductShow } from "apis/excelAPI";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";
import { RequestCreateProduct } from "apis/productAPI";
import AddSingleProductModal from "./AddProductModal";
import ConnectExternalModal from "../../components/ConnectExternalModal";
import externalAPI from "../../apis/eternalAPI";

function ProductPreviewList() {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [successList, setSuccessList] = useState<Array<ProductShow>>([]);
  const [failList, setFailList] = useState<Array<Product>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

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
      setFailList(data.data.fail);
    },
  });

  const connectProductQuery = useMutation("connectProduct", externalAPI.getSellmateProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      if (data.msg) {
        message.error(data.msg);
        resetField();
        return;
      }
      message.info(`이미 등록된 상품이 ${data.data.count.fail_count}건 있습니다.`);
      setSuccessList([
        ...data.data.success.map((product) => ({
          ...product,
          memo_value: product.memo,
          memo_active: !!product.memo,
        })),
        ...successList,
      ]);
      setFailList(data.data.fail);
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
  }, []);

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id?.toString() ?? "");
    parseProductQuery.mutate(form);
  };

  useEffect(() => {
    resetField();
  }, [store.id, resetField]);

  const addItem = useCallback(
    (item: ProductShow) => {
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
        price: parseInt(product.price),
      });
    });
    createProductQuery.mutate(resultList);
  }, [successList, store.id]);

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
          onClick={() => {
            if (!store.id) {
              message.warn(t("message.select store"));
              return;
            }
            setConnectModalVisible(true);
          }}
        >
          {t("button.connect external program")}
        </TurtleButtonSub>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add product")} <DownOutlined />
          </Button>
        </Dropdown>
      </Toolbar>
      <Row>
        <TurtleText>{t("product.preview list")}</TurtleText>
      </Row>
      <Row>
        <Table
          size="small"
          loading={parseProductQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          dataSource={successList}
          rowKey={(record) => record.product_code}
          style={{ height: "52vh" }}
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
              title: t("product.price"),
              render: (_, record) => record.price,
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
      {/* 재고프로그램 연동 모달*/}
      <ConnectExternalModal
        visible={connectModalVisible}
        closeModal={() => {
          setConnectModalVisible(false);
        }}
        onClick={async ({ start_date, end_date }) => {
          await connectProductQuery.mutateAsync({ rt_store_id: store.id!, start_date, end_date });
          await setConnectModalVisible(false);
        }}
        loading={connectProductQuery.isLoading}
      />
    </>
  );
}

export default ProductPreviewList;
