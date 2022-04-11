import { message, Select, Space, Typography } from "antd";
import { useQuery } from "react-query";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import { useRecoilState } from "recoil";
import { Store, storeState } from "store/storeState";
import { t } from "i18next";
import { useState, useEffect, useCallback } from "react";

interface Props {
  warningMessage?: string;
}

function StoreSelect({ warningMessage }: Props) {
  const [store, setStore] = useRecoilState(storeState);
  const [storeList, setStoreList] = useState<Array<Store>>([]);

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
        if (data.data.data.length === 0) return;

        // storeList 채워준다.
        setStoreList(
          data.data.data
            .filter((store) => !store.is_closed)
            .map((store) => ({
              id: store.id,
              name: store.name,
            })),
        );

        // 쇼핑몰이 1개일때는 해당 쇼핑몰 선택
        if (data.data.data.length === 1) {
          setStore({ id: data.data.data[0].id, name: data.data.data[0].name });
        }
      },
    },
  );

  // 쇼핑몰 선택
  const handleChange = useCallback(
    (value: number) => {
      // store.id 가 기존에 있으면 confirm 받고 false 시 return;
      if (store.id && warningMessage && !window.confirm(warningMessage)) {
        return;
      }

      // setStore 한다.
      setStore({ id: value, name: storeList.find((item) => item.id === value)!.name });
    },
    [store, storeList, setStore, warningMessage],
  );

  // 페이지 바뀔때 마다 storeId 초기화
  useEffect(() => () => {
    setStore({ id: undefined, name: "" });
  });

  return (
    <Space size="large">
      <Typography.Text style={{ fontSize: "16px" }}>{t("store.name")}</Typography.Text>
      <Select
        placeholder={t("description.select mall")}
        loading={getStoresQuery.isLoading}
        style={{ width: "20rem" }}
        onChange={handleChange}
        value={store.id}
      >
        {storeList.map((store) => (
          <Select.Option key={store.id} value={store.id}>
            {store.name}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
}

export default StoreSelect;
