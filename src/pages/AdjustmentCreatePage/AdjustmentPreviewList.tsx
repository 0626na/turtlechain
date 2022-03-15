import styled from "styled-components";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
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
} from "antd";
import adjustmentAPI, { AdjustmentProduct } from "apis/adjustmentAPI";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import Toolbar from "components/Toolbar";
import { FileOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import AddSingleProductModal, { AddProduct } from "components/AddProductModal";
import TurtleText from "components/common/TurtleText";
import TurtleInfo from "components/common/TurtleInfo";
import { pricePattern } from "utils/pattern";
import { BaseOptionType } from "antd/lib/select";
import TurtleButton from "components/common/TurtleButton";

const AdjustmentListPreview = function () {
  const store = useRecoilValue(storeState);
  const [successList, setSuccessList] = useState<Array<AdjustmentProduct>>([]);
  const [failList, setFailList] = useState<Array<AdjustmentProduct>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const index = useRef(0);

  const createAdjustmentQuery = useMutation(["createAdjustment"], adjustmentAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
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
    (product: AddProduct) => {
      setSuccessList([{ ...product, index: index.current++, type: "reserve" }, ...successList]);
      return true;
    },
    [successList, index],
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
      console.log(value);
    },
    [successList],
  );

  const onClickCreate = useCallback(() => {
    createAdjustmentQuery.mutate({
      item_list: successList.map((product) => ({
        rt_store_id: store.id!,
        vendor_id: product.vendor_id,
        product_id: product.product_id,
        count: product.product_count,
        price: product.product_price,
        type: product.type,
        // TODO: 임시 세금 미포함
        is_vat_included: false,
        memo: product.memo,
      })),
    });
  }, [successList, store.id]);

  // 매입조정 합계
  const totalPrice = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [successList],
  );

  let adjTypes = {
    exchange: "교환",
    reserve: "미송",
    refund: "환불",
    takeback: "반품",
  };

  const selectOptions: BaseOptionType[] = [
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
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
            icon={<FileOutlined />}
          >
            {t("button.add adjustment")} <DownOutlined />
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
              rowKey={(record) => record.index}
              pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
              scroll={{ y: "auto" }}
              footer={() => `공급가 합계 : ${totalPrice.toLocaleString()}원`}
              columns={[
                {
                  ellipsis: true,
                  width: "10%",
                  title: t("vendor.name"),
                  render: (_, record) => record.vendor_name,
                },
                {
                  ellipsis: true,
                  width: "10%",
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
                  width: "11%",
                  title: t("adjustment.type."),
                  render: (_, record) => (
                    <Select
                      size="small"
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
                {
                  ellipsis: true,
                  width: "11%",
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
                  width: "11%",
                  title: t("adjustment.count"),
                  render: (_, record) => (
                    <InputNumber
                      size="small"
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

      {/* 상품 단건 추가 모달 */}
      <AddSingleProductModal
        visible={addProductModalVisible}
        closeModal={() => {
          setAddProductModalVisible(false);
        }}
        addProduct={addProduct}
      />
    </>

    // <Table
    //   size="small"
    //   scroll={{ x: "auto", y: 400 }}
    //   pagination={false}
    //   dataSource={adjList}
    //   columns={[
    //     {
    //       title: t("vendor.name"),
    //       dataIndex: "vendor_name",
    //     },
    //     {
    //       title: t("vendor.address"),
    //       dataIndex: "vendor_address",
    //     },
    //     {
    //       title: t("product.name"),
    //       dataIndex: "product_name",
    //     },
    //     {
    //       title: t("product.vendor_product_name"),
    //       dataIndex: "vendor_product_name",
    //     },
    //     {
    //       width: 100,
    //       align: "center",
    //       title: t("adjustment type"),
    //       dataIndex: "type",
    //       render: (_, record) => adjTypes[record.type],
    //     },
    //     {
    //       title: t("supply price"),
    //       render: (_, record) => numberTextFormat(record.price, "currency"),
    //     },
    //     {
    //       width: 100,
    //       align: "center",
    //       title: " ",
    //       dataIndex: "action",
    //       render: (_, record) => (
    //         <Button //
    //           danger
    //           icon={<DeleteFilled />}
    //           size="small"
    //           shape="round"
    //           type="primary"
    //           onClick={() => {
    //             console.log(record);
    //             const newList = adjList.filter((item) => item.product_id !== record.product_id);
    //             setAdjList(newList);
    //           }}
    //         >
    //           {t("delete")}
    //         </Button>
    //       ),
    //     },
    //   ]}
    //   footer={() => (
    //     <Footer>
    //       <b>
    //         {`${t("total supply price")} : `}
    //         {numberTextFormat(totalAdjValue, "currency")}
    //       </b>
    //       <Popconfirm
    //         title={t("description.really register")}
    //         okText={t("yes")}
    //         cancelText={t("no")}
    //         onConfirm={() => {
    //           onSubmit();
    //         }}
    //       >
    //         <Button //
    //           icon={<UploadOutlined />}
    //           disabled={!adjList.length}
    //           //loading={isLoading}
    //           type="primary"
    //         >
    //           {t("adjustment create")}
    //         </Button>
    //       </Popconfirm>
    //     </Footer>
    //   )}
    // />
  );
};

export default AdjustmentListPreview;
