import {
  Table,
  Popconfirm,
  Input,
  message,
  notification,
  Menu,
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
import { FileTextOutlined } from "@ant-design/icons";
import { storeState } from "store/storeState";
import { useRecoilValue } from "recoil";
import { pricePattern } from "utils/pattern";
import { MainContent, MenuBar, BottomBar } from "layouts/main";
import { TurtleButton, TurtleDropdown, TurtleIcon } from "components/common";
import { useStoreExist } from "hooks";
import AddProductModal from "./AddProductModal";
import LoadWarehousingModal from "./LoadWarehousingModal";

const PageBody = function () {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [successList, setSuccessList] = useState<Array<AdjustmentProduct>>([]);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [loadWarehousingModalVisible, setLoadWarehousingModalVisible] = useState(false);
  const index = useRef(0);

  const createAdjustmentQuery = useMutation(["createAdjustment"], adjustmentAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data.msg);
    },
    onSuccess: (data) => {
      resetStates();
      notification.open({
        type: "success",
        message: t("message.success create adjustment"),
      });
    },
  });

  const resetStates = useCallback(() => {
    setSuccessList([]);
  }, []);

  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

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

  // successList의 index의 type값을 value로 바꿔서 return 한다.
  const changeSuccessList = useCallback(
    (type: string, index, value) =>
      successList.map((product) =>
        product.index === index ? { ...product, [type]: value } : product,
      ),
    [successList],
  );

  // 매입조정 등록하기 버튼 클릭
  const onClickCreate = useCallback(() => {
    if (!validateSuccessList()) {
      message.warn("매입조정 수량, 종류를 확인해주세요.");
      return;
    }
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
  }, [store.id, successList]);

  // 수량, 종류 선택되었는지 확인해서 이상없으면 true, 이상있으면 false
  const validateSuccessList = useCallback(() => {
    let isValid = true;
    // 수량, 종류 선택했는지 확인
    successList.forEach((product) => {
      if (product.type === "" || product.product_count === 0) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }, [successList]);

  // 매입조정 합계
  const totalPrice = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [successList],
  );

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          if (!isStoreExist()) return;
          setLoadWarehousingModalVisible(true);
        }}
      >
        {t("button.load warehousing")}
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          if (!isStoreExist()) return;
          setAddProductModalVisible(true);
        }}
      >
        {t("button.add reserve product")}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <MenuBar isWarning>
        <TurtleDropdown
          menu={menu} //
        >
          {t("button.add adjustment")}
        </TurtleDropdown>
      </MenuBar>

      <MainContent title={t("adjustment.preview")}>
        <Tabs defaultActiveKey="1" size="large" style={{ width: "100%" }}>
          <Tabs.TabPane tab={`성공(${successList.length})`} key="1">
            <Table
              size="small"
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
                      setSuccessList(changeSuccessList("memo", record.index, e.target.value));
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
                        setSuccessList(
                          changeSuccessList(
                            "is_vat_included",
                            record.index,
                            !record.is_vat_included,
                          ),
                        );
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
                        setSuccessList(changeSuccessList("product_price", record.index, value));
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
                      max={record.product_count_max}
                      value={record.product_count}
                      onChange={(value) => {
                        setSuccessList(changeSuccessList("product_count", record.index, value));
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: 100,
                  title: t("adjustment.type."),
                  render: (_, record) =>
                    record.type === "reserve" ? (
                      <Select
                        size="small"
                        style={{ width: 70 }}
                        value={record.type}
                        onSelect={(value: string) => {
                          setSuccessList(changeSuccessList("type", record.index, value));
                        }}
                      >
                        {["reserve"].map((option) => (
                          <Select.Option key={option} value={option}>
                            {t(`adjustment.type.${option}`)}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Select
                        size="small"
                        status={record.type === "" ? "error" : ""}
                        style={{ width: 70 }}
                        value={record.type}
                        onSelect={(value: string) => {
                          setSuccessList(changeSuccessList("type", record.index, value));
                        }}
                      >
                        {["takeback", "exchange"].map((option) => (
                          <Select.Option key={option} value={option}>
                            {t(`adjustment.type.${option}`)}
                          </Select.Option>
                        ))}
                      </Select>
                    ),
                },
                Table.EXPAND_COLUMN,
                {
                  ellipsis: true,
                  width: 30,
                  render: (_, record) => (
                    <TurtleIcon
                      type="delete"
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

        {/* 입고내역 불러오기 모달*/}
        <LoadWarehousingModal
          visible={loadWarehousingModalVisible}
          closeModal={() => {
            setLoadWarehousingModalVisible(false);
          }}
          addProduct={addProduct}
        />

        {/* 미송상품 단건 추가 모달 */}
        <AddProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
          addProduct={addProduct}
        />
      </MainContent>

      <BottomBar>
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
      </BottomBar>
    </>
  );
};

export default PageBody;
