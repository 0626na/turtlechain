import {
  Table,
  Button,
  Popconfirm,
  Input,
  message,
  notification,
  Dropdown,
  Menu,
  Row,
  Tabs,
  InputNumber,
  Select,
  Switch,
} from "antd";
import adjustmentAPI, { AdjustmentProduct } from "apis/adjustmentAPI";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { FileTextOutlined, FileOutlined, DeleteOutlined } from "@ant-design/icons";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import AddProductModal from "./AddProductModal";
import { pricePattern } from "utils/pattern";
import LoadWarehousingModal from "./LoadWarehousingModal";
import { Toolbar } from "layouts/main";
import { TurtleButton, TurtleText } from "components/common";

const AdjustmentListPreview = function () {
  const store = useRecoilValue(storeState);
  const [successList, setSuccessList] = useState<Array<AdjustmentProduct>>([]);
  const [failList, setFailList] = useState<Array<AdjustmentProduct>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [loadWarehousingModalVisible, setLoadWarehousingModalVisible] = useState(false);
  const index = useRef(0);

  const createAdjustmentQuery = useMutation(["createAdjustment"], adjustmentAPI.create, {
    onError: (error: AxiosError) => {
      message.error("매입조정 종류를 입력해주세요");
    },
    onSuccess: (data) => {
      resetField();
      notification.open({
        type: "success",
        message: t("message.success create adjustment"),
      });
    },
  });

  const resetField = useCallback(() => {
    setSuccessList([]);
    setFailList([]);
  }, []);

  useEffect(() => {
    resetField();
  }, [store.id, resetField]);

  // 상품 추가
  const addProduct = useCallback(
    (product: AdjustmentProduct) => {
      setSuccessList((prevState) => [{ ...product, index: index.current++ }, ...prevState]);
      return true;
    },
    [index],
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (index) => {
      setSuccessList(successList.filter((product) => product.index !== index));
    },
    [successList],
  );

  // 공급가 변경
  const setPrice = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, product_price: value } : product,
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
          product.index === index ? { ...product, product_count: value } : product,
        ),
      );
    },
    [successList],
  );

  // 매입조정 타입 변경
  const setType = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, type: value } : product,
        ),
      );
    },
    [successList],
  );

  // 메모 변경
  const setMemo = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, memo: value } : product,
        ),
      );
    },
    [successList],
  );

  // 부가세 변경
  const setIsVatIncluded = useCallback(
    (value, index) => {
      setSuccessList(
        successList.map((product) =>
          product.index === index ? { ...product, is_vat_included: value } : product,
        ),
      );
    },
    [successList],
  );

  // 매입조정 등록하기 버튼 클릭
  const onClickCreate = useCallback(() => {
    createAdjustmentQuery.mutate({
      item_list: successList.map((product) => ({
        rt_store_id: store.id!,
        vendor_id: product.vendor_id,
        product_id: product.product_id,
        warehousing_item_id: product.warehousing_item_id,
        count: product.product_count,
        price: product.product_price,
        type: product.type,
        is_vat_included: product.is_vat_included,
        memo: product.memo,
      })),
    });
  }, [successList, store.id]);

  // 매입조정 합계
  const totalPrice = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [successList],
  );

  const selectOptions = [
    { name: "미송", value: "reserve" },
    { name: "교환", value: "exchange" },
    { name: "반품", value: "takeback" },
    { name: "환불", value: "refund" },
  ];

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          if (!store.id) {
            message.warn(t("message.select store"));
            return;
          }
          setLoadWarehousingModalVisible(true);
        }}
      >
        {t("button.load warehousing")}
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
        {t("button.add reserve product")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Toolbar isWarning>
        <Dropdown overlay={menu}>
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add adjustment")}
          </Button>
        </Dropdown>
      </Toolbar>

      <Row style={{ paddingTop: 30, paddingBottom: 0 }}>
        <TurtleText>{`${t("adjustment.preview")}`}</TurtleText>

        <Tabs defaultActiveKey="1" size="large" style={{ width: "100%" }}>
          <Tabs.TabPane tab={`성공(${successList.length})`} key="1">
            <Table
              size="small"
              //loading={}
              dataSource={successList}
              rowKey={(record) => record.index!}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              scroll={{ y: "auto" }}
              footer={() => `공급가 합계 : ${totalPrice.toLocaleString()}원`}
              expandable={{
                columnWidth: 25,
                expandIcon: ({ expanded, onExpand, record }) => (
                  <FileTextOutlined
                    style={record.memo ? {} : { opacity: "0.4" }}
                    onClick={(e) => onExpand(record, e)}
                  />
                ),
                expandedRowRender: (record) => (
                  <Input
                    value={record.memo}
                    onChange={(e) => {
                      setMemo(e.target.value, record.index);
                    }}
                  />
                ),
              }}
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
                  render: (_, record) => record.product_name,
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
                  render: (_, record) => record.product_option,
                },
                {
                  ellipsis: true,
                  title: "부가세 포함 여부",
                  render: (_, record) => (
                    <Switch
                      style={{ width: "52px" }}
                      checkedChildren={t("button.include")}
                      checked={record.is_vat_included}
                      onClick={() => {
                        setIsVatIncluded(!record.is_vat_included, record.index);
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: 110,
                  title: t("product.price"),
                  render: (_, record) => (
                    <InputNumber
                      size="small"
                      step={1000}
                      value={record.product_price}
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
                  width: 110,
                  title: t("adjustment.count"),
                  render: (_, record) => (
                    <InputNumber
                      size="small"
                      status={record.product_count === 0 ? "error" : ""}
                      min={1}
                      value={record.product_count}
                      onChange={(value) => {
                        setCount(value, record.index);
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: 100,
                  title: t("adjustment.type."),
                  render: (_, record) => (
                    <Select
                      size="small"
                      status={record.type === "" ? "error" : ""}
                      style={{ width: 70 }}
                      value={record.type}
                      onSelect={(value: string) => {
                        setType(value, record.index);
                      }}
                    >
                      {selectOptions.map((option) => {
                        return (
                          <Select.Option key={option.value} value={option.value}>
                            {option.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  ),
                },
                Table.EXPAND_COLUMN,
                {
                  ellipsis: true,
                  width: 30,
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
            loading={createAdjustmentQuery.isLoading}
          >
            {t("button.create adjustment")}
          </TurtleButton>
        </Popconfirm>
      </Row>

      {/* 미송상품 단건 추가 모달 */}
      <AddProductModal
        visible={addProductModalVisible}
        closeModal={() => {
          setAddProductModalVisible(false);
        }}
        addProduct={addProduct}
      />

      {/* 입고내역 불러오기 모달*/}
      <LoadWarehousingModal
        visible={loadWarehousingModalVisible}
        closeModal={() => {
          setLoadWarehousingModalVisible(false);
        }}
        addProduct={addProduct}
      />
    </>
  );
};

export default AdjustmentListPreview;
