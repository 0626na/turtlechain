import moment from "moment";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useMutation } from "react-query";
import warehousingAPI, { CreateSheetItem } from "apis/warehousingAPI";

import { message, notification } from "antd";

import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import StoreSelect from "components/StoreSelect";

import WarehousingCreateForm from "./WarehousingCreateForm";
import WarehousingPreviewList from "./WarehousingPreviewList";

interface SheetItem extends CreateSheetItem {
  temp_id: number;
}

const WarehousingCreatePage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing create")}`;

  const [mall_id, setMallId] = useState(-1);
  const [mall_name, setMallName] = useState("");
  const [temp_id, setTempId] = useState(1);
  const [list, setList] = useState<Array<SheetItem>>([]);

  // 입고장 생성 절차
  // 1. 입고장 추가하기 요청
  // 2. 입고장 생성을 통해 얻은 sheet_id를 가지고 입고장 상세내역 추가하기 요청

  // 입고장 추가하기 요청
  const createSheetQuery = useMutation(
    ["createSheet"],
    warehousingAPI.createSheet,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        createSheetItemQuery.mutate({
          sheet_id: data.data,
          item_list: list.map((item) => ({
            ...item,
            mall_id,
            mall_name,
          })),
        });
      },
    }
  );

  // 입고장 상세내역 추가하기 요청
  const createSheetItemQuery = useMutation(
    ["createSheetItem"],
    warehousingAPI.createSheetItem,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        setMallId(-1);
        setMallName("");
        setTempId(1);
        setList([]);
        notification.open({
          type: "success",
          message: t("message.success create warehousing"),
        });
      },
    }
  );

  // 입고장 아이템 추가
  const onCreate = (value: CreateSheetItem) => {
    setList([...list, { ...value, temp_id }]);
    setTempId(temp_id + 1);
  };

  // 입고장 등록
  const onSubmit = () => {
    if (mall_id === -1 || !mall_name) {
      message.error(t("description.select mall"));
    } else {
      createSheetQuery.mutate({
        created_date: moment().format("YYYY-MM-DD"),
        mall_id,
        mall_name,
      });
    }
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/warehousing.svg`}
            alt="warehousing"
          />
        }
        title={t("warehousing create")}
        breadcrumbList={[t("warehousing management"), t("warehousing create")]}
      />
      <div>
        <StoreSelect
          width={200}
          emptyValueText={`${t("mall")} ${t("select")}`}
          value={mall_id === -1 ? "" : mall_id}
          onChange={(value, label) => {
            setMallId(value ? value : -1);
            setMallName(label);
          }}
        />
      </div>
      <WarehousingCreateForm onCreate={onCreate} />
      <WarehousingPreviewList
        isLoading={createSheetQuery.isLoading || createSheetItemQuery.isLoading}
        list={list}
        setList={setList}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default WarehousingCreatePage;
