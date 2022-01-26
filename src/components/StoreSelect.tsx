import { message, Select, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

interface Props {
  selectStore: (storeId: number) => void;
}

function CustomStoreSelect({ selectStore }: Props) {
  const { t } = useTranslation();

  // 쇼핑몰 식별 번호
  const [storeId, setStoreId] = useState<number>();

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
      onSuccess: (data) => {
        //setStoreId(data.data.data[0].id);
        //selectStore(data.data.data[0].id);
      },
    },
  );

  // 쇼핑몰 선택
  const handleChange = useCallback((value: number) => {
    setStoreId(value);
    selectStore(value);
  }, []);

  return (
    <Space size="large">
      <Typography.Text style={{ fontSize: "16px" }}>{t("store.name")}</Typography.Text>
      <Select
        placeholder={t("description.select mall")}
        loading={getStoresQuery.isLoading}
        style={{ width: "20rem" }}
        onChange={handleChange}
        value={storeId}
        size="large"
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
