import styled from "styled-components";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { Table, Button, Popconfirm, Input, message, notification, Dropdown, Menu } from "antd";
import adjustmentAPI, { AdjustmentProduct } from "apis/adjustmentAPI";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import Toolbar from "components/Toolbar";
import { FileOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import AddSingleProductModal, { AddProduct } from "components/AddProductModal";

const AdjustmentListPreview = function () {
  const store = useRecoilValue(storeState);
  const [successList, setSuccessList] = useState<Array<AdjustmentProduct>>([]);
  const [failList, setFailList] = useState<Array<AdjustmentProduct>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  const addProduct = useCallback((product: AddProduct) => {
    setSuccessList([product, ...successList]);
    return false;
  }, []);

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

  const onSubmit = () => {
    createAdjustmentQuery.mutate({
      item_list: successList,
    });
  };

  // 매입조정 합계
  const totalAdjValue = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [successList],
  );

  let adjTypes = {
    exchange: "교환",
    reserve: "미송",
    refund: "환불",
    takeback: "반품",
  };

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
