import { Menu, message, notification, Popconfirm, Tabs } from "antd";
import { t } from "i18next";
import { storeState } from "store/storeState";
import { useRecoilState, useRecoilValue } from "recoil";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { excelAPI, productAPI, externalAPI } from "apis";
import { useCallback, useEffect, useState } from "react";
import { RcFile } from "antd/lib/upload";
import { BottomBar, MainContent, MenuBar } from "layouts/main";
import { TurtleButton, TurtleButtonSub, TurtleDropdown, TurtleUpload } from "components/common";
import { useStoreExist } from "hooks";
import { productCartState } from "store/productCartState";
import { ResponseParseProduct } from "apis/excelAPI";
import { ResponseConnectProduct } from "apis/externalAPI";
import AddSingleProductModal from "./AddProductModal";
import SuccessTab from "./SuccessTab";
import FailTab from "./FailTab";

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [cart, setCart] = useRecoilState(productCartState);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  // 엑셀파싱 요청
  const parseQuery = useMutation("parseProduct", excelAPI.parseProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      updateStates(data);
    },
  });

  // 재고관리 연동 요청
  const connectQuery = useMutation("connectProduct", externalAPI.connectSellmateProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      updateStates(data);
    },
  });

  const createQuery = useMutation(
    ["createProduct"], //
    productAPI.create,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        resetStates();
        notification.open({
          type: "success",
          message: `성공적으로 등록하였습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
        });
      },
    },
  );

  // 모든 상태 초기화
  const resetStates = useCallback(() => {
    setCart({
      fileList: [],
      successList: [],
      failList: [],
    });
    connectQuery.reset();
  }, [setCart]);

  // 파싱 or 연동 후 상태 세팅
  const updateStates = useCallback(
    (data: ResponseParseProduct | ResponseConnectProduct) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetStates();
        return;
      }
      message.info(`이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`);
      setCart((cart) => ({
        ...cart,
        successList: [
          ...data.data.success.map((product) => ({
            ...product,
            memo_value: product.memo,
            memo_active: !!product.memo,
          })),
          ...cart.successList,
        ],
        failList: [...data.data.fail, ...cart.failList],
      }));
    },
    [resetStates, setCart],
  );

  // 엑셀파일 파싱
  const parseFile = (file: RcFile) => {
    setCart((cart) => ({ ...cart, fileList: [file] }));
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id!.toString());
    parseQuery.mutate(form);
  };

  // 재고 연동 버튼 클릭
  const onClickConnect = useCallback(() => {
    if (!isStoreExist()) return;
    connectQuery.mutateAsync({ rt_store_id: store.id! });
  }, [store.id, connectQuery, isStoreExist]);

  // 쇼핑몰 변경시 모든 state 초기화
  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <TurtleUpload //
          beforeUpload={parseFile}
          onRemove={resetStates}
          fileList={cart.fileList}
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
          {t("button.add product")}
        </TurtleDropdown>
      </MenuBar>

      <MainContent title={t("product.preview")} info={t("description.fail product")}>
        {/* 성공 실패 탭 */}
        <Tabs defaultActiveKey="1" size="large" style={{ width: "100%" }}>
          <SuccessTab
            key="1"
            tab={`성공(${cart.successList.length})`}
            loading={connectQuery.isLoading || parseQuery.isLoading}
          />
          <FailTab
            key="2"
            tab={`실패(${cart.failList.length})`}
            loading={connectQuery.isLoading || parseQuery.isLoading}
          />
        </Tabs>

        {/* 상품 단건 추가 모달 */}
        <AddSingleProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
        />
      </MainContent>

      <BottomBar>
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={() => {
            createQuery.mutate(
              cart.successList.map(
                ({
                  vendor_id,
                  product_code,
                  name,
                  price,
                  image_url,
                  vendor_product_name,
                  option,
                  memo,
                }) => ({
                  rt_store_id: store.id!,
                  vendor_id,
                  product_code,
                  name,
                  price,
                  image_url: image_url ?? "",
                  vendor_product_name,
                  option,
                  memo: memo ?? "",
                }),
              ),
            );
          }}
        >
          <TurtleButton
            type="primary"
            disabled={cart.successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t("button.create product")}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
}

export default PageBody;
