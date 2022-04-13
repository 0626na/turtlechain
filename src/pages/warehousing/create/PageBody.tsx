import { t } from "i18next";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { message, Menu, notification, Tabs, Popconfirm } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { RcFile } from "antd/lib/upload";
import { BottomBar, MainContent, MenuBar } from "layouts/main";
import { TurtleButton, TurtleButtonSub, TurtleDropdown, TurtleUpload } from "components/common";
import { useStoreExist } from "hooks";
import { excelAPI, externalAPI, warehousingAPI } from "apis";
import { ResponseParseWarehousing } from "apis/excelAPI";
import { ResponseConnectWarehousing } from "apis/externalAPI";
import { warehousingCartState } from "store/warehousingCartState";
import AddProductModal from "./AddProductModal";
import SuccessTab from "./SuccessTab";
import FailTab from "./FailTab";

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [cart, setCart] = useRecoilState(warehousingCartState);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const index = useRef(0);

  // 엑셀파싱 요청
  const parseQuery = useMutation("parseWarehousing", excelAPI.parseWarehousing, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      updateStates(data);
    },
  });

  // 재고관리 연동 요청
  const connectQuery = useMutation("connectWarehousing", externalAPI.connectSellmateWarehousing, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      updateStates(data);
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
    setCart({
      fileList: [],
      successList: [],
      failList: [],
      searchQuery: { type: "all", search_string: "" },
    });
    connectQuery.reset();
  }, [setCart]);

  // 파싱 or 연동 후 상태 세팅
  const updateStates = useCallback(
    (data: ResponseParseWarehousing | ResponseConnectWarehousing) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetStates();
        return;
      }
      setCart((cart) => ({
        ...cart,
        successList: [
          ...data.data.success.map((item) => ({
            ...item,
            is_reserved: false,
            index: index.current++,
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
    connectQuery.mutate({ rt_store_id: store.id! });
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
          {t("button.add warehousing")}
        </TurtleDropdown>
      </MenuBar>

      <MainContent title={t("warehousing.preview")} info={t("description.check confirm")}>
        {/* 성공 실패 탭*/}
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
        <AddProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
          index={index}
        />
      </MainContent>

      <BottomBar>
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
              item: {
                rt_store_id: store.id!,
                item_list: cart.successList.map(
                  ({ vendor_id, product_id, count, price, is_reserved, memo }) => ({
                    vendor_id,
                    product_id,
                    count,
                    price,
                    is_reserved,
                    memo,
                  }),
                ),
              },
            });
          }}
        >
          <TurtleButton
            type="primary"
            disabled={cart.successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t("button.create warehousing")}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
}

export default PageBody;
