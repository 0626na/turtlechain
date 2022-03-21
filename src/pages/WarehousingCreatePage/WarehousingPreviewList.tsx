import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import warehousingAPI, { WarehousingProduct } from "apis/warehousingAPI";
import { FileOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Dropdown,
  Menu,
  Upload,
  notification,
  Row,
  Tabs,
  Table,
  Popconfirm,
  InputNumber,
} from "antd";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import Toolbar from "components/Toolbar";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { RcFile } from "antd/lib/upload";
import { excelAPI } from "apis";
import moment from "moment";
import TurtleText from "components/common/TurtleText";
import TurtleInfo from "components/common/TurtleInfo";
import TurtleButton from "components/common/TurtleButton";
import { pricePattern } from "utils/pattern";
import externalAPI from "apis/externalAPI";
import AddSingleProductModal from "./AddProductModal";

function WarehousingPreviewList() {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [successList, setSuccessList] = useState<Array<WarehousingProduct>>([]);
  const [failList, setFailList] = useState<Array<WarehousingProduct>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const index = useRef(0);
  const failIndex = useRef(0);

  // 엑셀파싱 요청
  const parseQuery = useMutation("parseWarehousing", excelAPI.parseWarehousing, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      setSuccessList([
        ...data.data.success.map((product) => ({
          ...product,
          index: index.current++,
        })),
        ...successList,
      ]);
      setFailList([...data.data.fail, ...failList]);
    },
  });

  // 재고관리 연동 요청
  const connectQuery = useMutation("connectWarehousing", externalAPI.connectSellmateWarehousing, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      setSuccessList([
        ...data.data.success.map((product) => ({
          ...product,
          index: index.current++,
        })),
        ...successList,
      ]);
      setFailList([...data.data.fail, ...failList]);
    },
  });

  // 입고장 생성 요청
  const createQuery = useMutation("createWarehousing", warehousingAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      resetField();
      notification.open({
        type: "success",
        message: t("message.success create warehousing"),
      });
    },
  });

  // 엑셀파일 업로드
  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id!.toString());
    parseQuery.mutate(form);
  };

  // 모든 상태 초기화
  const resetField = useCallback(() => {
    setFileList([]);
    setSuccessList([]);
    setFailList([]);
  }, []);

  // 쇼핑몰 변경시 모든 state 초기화
  useEffect(() => {
    resetField();
  }, [store.id, resetField]);

  const onClickConnect = useCallback(() => {
    if (!store.id) {
      message.warn(t("message.select store"));
      return;
    }
    connectQuery.mutate({ rt_store_id: store.id! });
  }, [store.id]);

  // 상품 추가
  const addProduct = useCallback(
    (product: WarehousingProduct) => {
      setSuccessList([{ ...product, index: index.current++ }, ...successList]);
      return true;
    },
    [successList, index],
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (index) => {
      setSuccessList(successList?.filter((product) => product.index !== index));
    },
    [successList],
  );

  // 입고 수량 합계
  const totalProductCount = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.count, 0),
    [successList],
  );

  // 공급가 합계
  const totalProductPrice = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.count * cur.price, 0),
    [successList],
  );

  // 공급가 변경
  const setPrice = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, price: value } : product,
        ),
      );
    },
    [successList],
  );

  // 입고수량 변경
  const setCount = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, count: value } : product,
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
          disabled={connectQuery.isSuccess}
        >
          {t("button.connect external program")}
        </TurtleButtonSub>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add warehousing")}
          </Button>
        </Dropdown>
      </Toolbar>

      <Row style={{ paddingTop: 30, paddingBottom: 0 }}>
        <TurtleText>
          {`${t("warehousing.preview")}`}
          <br />
          <TurtleInfo>마감 이후에는 수정 및 삭제가 불가하오니 업무 시 참고바랍니다.</TurtleInfo>
        </TurtleText>

        <Tabs defaultActiveKey="1" size="large" style={{ width: "100%" }}>
          <Tabs.TabPane tab={`성공(${successList.length})`} key="1">
            <Table
              size="small"
              loading={connectQuery.isLoading || parseQuery.isLoading}
              dataSource={successList}
              rowKey={(record) => record.index!}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              scroll={{ y: "auto" }}
              footer={() =>
                `입고수량 합계 : ${totalProductCount}개 | 공급가 합계 : ${totalProductPrice.toLocaleString()}원`
              }
              columns={[
                {
                  ellipsis: true,
                  width: "10%",
                  title: t("vendor.name"),
                  render: (_, record) => record.vendor_name,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("vendor.address"),
                  render: (_, record) => record.vendor_address,
                },
                {
                  ellipsis: true,
                  title: t("product.name"),
                  render: (_, record) => record.product_name,
                },
                {
                  ellipsis: true,
                  title: t("product.vendor product name"),
                  render: (_, record) => record.vendor_product_name,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("product.code"),
                  render: (_, record) => record.product_code,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("product.option"),
                  render: (_, record) => record.product_option,
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
                        setPrice(value, record.index);
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("warehousing.count"),
                  render: (_, record) => (
                    <InputNumber
                      size="small"
                      min={1}
                      value={record.count}
                      onChange={(value) => {
                        setCount(value, record.index);
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: "8%",
                  render: (_, record) => (
                    <DeleteOutlined //
                      style={{ cursor: "pointer", color: "#A1A2A6" }}
                      onClick={() => {
                        deleteProduct(record.index);
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
              loading={connectQuery.isLoading || parseQuery.isLoading}
              dataSource={failList}
              rowKey={(record) => failIndex.current++}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              scroll={{ y: "auto" }}
              columns={[
                {
                  ellipsis: true,
                  width: "'8%",
                  title: t("vendor.name"),
                  render: (_, record) => record.vendor_name,
                },
                {
                  ellipsis: true,
                  width: "'8%",
                  title: t("vendor.address"),
                  render: (_, record) => record.vendor_address,
                },
                {
                  ellipsis: true,
                  title: t("product.name"),
                  render: (_, record) => (
                    <span style={{ color: "red" }}>{record.product_name}</span>
                  ),
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
                  width: "12%",
                  title: t("product.code"),
                  render: (_, record) => record.product_code,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("product.option"),
                  render: (_, record) => record.product_option,
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("product.price"),
                  render: (_, record) => record.price.toLocaleString(),
                },
                {
                  ellipsis: true,
                  width: "12%",
                  title: t("warehousing.count"),
                  render: (_, record) => record.count,
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
          onConfirm={() => {
            createQuery.mutate({
              sheet: {
                created_date: moment().format("YYYY-MM-DD"),
                rt_store_id: store.id!,
              },
              product: {
                rt_store_id: store.id!,
                item_list: successList.map((product) => ({
                  vendor_id: product.vendor_id,
                  product_id: product.product_id,
                  count: product.count,
                  price: product.price,
                  memo: product.memo,
                })),
              },
            });
          }}
        >
          <TurtleButton
            type="primary"
            disabled={successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t("button.create warehousing")}
          </TurtleButton>
        </Popconfirm>
      </Row>

      {/* 상품 단건 추가 모달 */}
      <AddSingleProductModal
        visible={addProductModalVisible}
        closeModal={() => {
          setAddProductModalVisible(false);
        }}
        addProduct={addProduct}
      />
    </>
  );
}

export default WarehousingPreviewList;
