import { message, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import TurtleSelect from "./common/TurtleSelect";
import { useQuery } from "react-query";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";

function CustomStoreSelect() {
  const { t } = useTranslation();

  // 쇼핑몰 불러오기 요청
  const getStoresQuery = useQuery(
    ["getStores"],
    () =>
      retailerStoreAPI.getStores({
        offset: 1000,
        last_id: -1,
        switch_type: "next",
        search_type: "",
        search_query: "",
      }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  return (
    <Space size="large">
      <Typography.Text>{t("store.name")}</Typography.Text>
      <TurtleSelect
        placeholder={t("description.select mall")}
        options={getStoresQuery.data?.data.data}
        loading={getStoresQuery.isLoading}
      />
    </Space>
  );
}

export default CustomStoreSelect;
