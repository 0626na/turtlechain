import { message, Select, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
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
      <Select
        placeholder={t("description.select mall")}
        loading={getStoresQuery.isLoading}
        style={{ width: "16rem" }}
      >
        {getStoresQuery.data?.data.data.map(({ name, id }) => {
          return (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          );
        })}
      </Select>
    </Space>
  );
}

export default CustomStoreSelect;
