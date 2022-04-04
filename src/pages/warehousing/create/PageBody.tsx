import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message, Menu, notification, Row, Tabs, Table, Popconfirm, InputNumber } from "antd";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { RcFile } from "antd/lib/upload";
import { excelAPI, externalAPI, warehousingAPI } from "apis";
import { pricePattern } from "utils/pattern";
import { MainContent, MenuBar } from "layouts/main";
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleDropdown,
  TurtleIcon,
  TurtleUpload,
} from "components/common";
import { useStoreExist } from "hooks";
import { ResponseParseWarehousing } from "apis/excelAPI";
import { ResponseConnectWarehousing } from "apis/externalAPI";
import { WarehousingProduct } from "apis/warehousingAPI";
import AddProductModal from "./AddProductModal";

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
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
      setStates(data);
    },
  });

  // 재고관리 연동 요청
  const connectQuery = useMutation("connectWarehousing", externalAPI.connectSellmateWarehousing, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setStates(data);
    },
  });

  // 입고장 생성 요청
  const createQuery = useMutation("createWarehousing", warehousingAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      resetStates();
      notification.open({
        type: "success",
        message: t("message.success create warehousing"),
      });
    },
  });

  // 모든 상태 초기화
  const resetStates = useCallback(() => {
    setFileList([]);
    setSuccessList([]);
    setFailList([]);
  }, []);

  // 파싱 or 연동 후 상태 세팅
  const setStates = useCallback(
    (data: ResponseParseWarehousing | ResponseConnectWarehousing) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetStates();
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
    [successList, failList, resetStates],
  );

  // 엑셀파일 업로드
  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id!.toString());
    parseQuery.mutate(form);
  };

  // 쇼핑몰 변경시 모든 state 초기화
  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

  // 재고 연동 버튼 클릭
  const onClickConnect = useCallback(() => {
    if (!isStoreExist()) return;
    connectQuery.mutate({ rt_store_id: store.id! });
  }, [store.id, connectQuery, isStoreExist]);

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

  // 입고 수량 합계 계산
  const totalProductCount = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.count, 0),
    [successList],
  );

  // 공급가 합계 계산
  const totalProductPrice = useMemo(
    () => successList.reduce((acc, cur) => acc + cur.count * cur.price, 0),
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

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <TurtleUpload
          beforeUpload={(file) => {
            setFileList([file]);
            loadFile(file);
          }}
          onRemove={resetStates}
          fileList={fileList}
        />
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          if (!isStoreExist()) return;
          setAddProductModalVisible(true);
        }}
      >
        {t("button.add single product")}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <MenuBar isWarning>
        <TurtleButtonSub
          type="primary"
          color="skyblue"
          onClick={onClickConnect}
          disabled={connectQuery.isSuccess}
        >
          {t("button.connect external program")}
        </TurtleButtonSub>
        <TurtleDropdown //
          menu={menu}
        >
          {t("button.add warehousing")}
        </TurtleDropdown>
      </MenuBar>

      <MainContent //
        title={t("warehousing.preview")}
        info={t("description.check confirm")}
      >
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
                        setSuccessList(changeSuccessList("price", record.index, value));
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
                        setSuccessList(changeSuccessList("count", record.index, value));
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  width: "8%",
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
        <Row justify="end" style={{ paddingTop: 32 }}>
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
        <AddProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
          addProduct={addProduct}
        />
      </MainContent>
    </>
  );
}

export default PageBody;
