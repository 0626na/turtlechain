import { message, Select, Space, Typography } from "antd";
import { useQuery } from "react-query";
import { retailerStoreAPI } from "apis";
import { AxiosError } from "axios";
import { useRecoilState } from "recoil";
import { storeIdState } from "store/storeIdState";
import { t } from "i18next";
import { useCallback } from "react";
import { StoreId } from "../store/storeIdState"

interface Props {
  warningMessage?: string;
}

function CustomStoreSelect({ warningMessage }: Props) {
  // 쇼핑몰 식별 번호
  const [storeId, setStoreId] = useRecoilState(storeIdState);

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
        // TODO: 쇼핑몰이 1개일때는 해당 쇼핑몰 선택, 다중일때는 선택 안함 추가
      },
    },
  );

  // 쇼핑몰 선택
  const handleChange = useCallback((value: StoreId) => {
    setStoreId((prevStoreId) => {
      if (prevStoreId && warningMessage) {
        const answer = window.confirm(warningMessage);
        if (!answer) {
          return prevStoreId;
        }
      }
      return value;
    });
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
