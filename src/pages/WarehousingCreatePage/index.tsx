import moment from "moment";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import warehousingAPI, { CreateSheetItems, WarehousingSheetItem } from "apis/warehousingAPI";
import { Button, Form, message, notification, Typography } from "antd";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";
import WarehousingCreateForm from "./WarehousingCreateForm";
import WarehousingPreviewList from "./WarehousingPreviewList";
import { FileExcelOutlined, ExportOutlined } from "@ant-design/icons";
import WarehousingCreateFromOrderModal from "./WarehousingCreateFromOrderModal";
import { StoreId, storeIdState } from "store/storeIdState";
import { useRecoilValue } from "recoil";
import { storeNameState } from "store/storeNameState";
import Toolbar from "./Toolbar";
import { storeState } from "store/storeState";

const WarehousingCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing create")}`;

  const [list, setList] = useState<Array<WarehousingSheetItem>>([]);

  const [visibleCFOModal, setVisibleCFOModal] = useState(false);
  const storeId: number | undefined = useRecoilValue(storeIdState);
  const store = useRecoilValue(storeState);
  // 입고장 생성 절차
  // 1. 입고장 추가하기 요청
  // 2. 입고장 생성을 통해 얻은 sheet_id를 가지고 입고장 상세내역 추가하기 요청

  // 입고장 추가하기 요청
  const createSheetQuery = useMutation(["createSheet"], warehousingAPI.createSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      createSheetItemsQuery.mutate({
        sheet_id: data.data,
        rt_store_id: store.id!,
        item_list: list.map((item) => ({
          vendor_id: item.vendor_id,
          product_id: item.product_id,
          count: item.product_count,
          price: item.product_price,
        })),
      });
    },
  });

  // 입고장 상세내역 추가하기 요청
  const createSheetItemsQuery = useMutation(["createSheetItems"], warehousingAPI.createSheetItems, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      setList([]);
      notification.open({
        type: "success",
        message: t("message.success create warehousing"),
      });
    },
  });

  // 입고장 아이템 추가
  const onCreate = (value: WarehousingSheetItem) => {
    setList([...list, { ...value }]);
  };

  // 입고장 등록
  const onSubmit = () => {
    createSheetQuery.mutate({
      created_date: moment().format("YYYY-MM-DD"),
      rt_store_id: store.id!,
    });
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="warehousing"
        title={t("warehousing create")}
        breadcrumbList={[t("warehousing management"), t("warehousing create")]}
        info={t("warehousing.upload_title_details")}
      />

      <Toolbar />
      <WarehousingCreateFromOrderModal
        visible={visibleCFOModal}
        mall_name="hi"
        onClose={() => {
          setVisibleCFOModal(false);
        }}
      />

      <WarehousingCreateForm onSheetDetailsAdded={onCreate} />
      <WarehousingPreviewList
        isLoading={createSheetQuery.isLoading || createSheetItemsQuery.isLoading}
        list={list}
        setList={setList}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default WarehousingCreatePage;
