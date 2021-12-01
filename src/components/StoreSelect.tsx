// async
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import retailerStoreAPI from "apis/retailerStoreAPI";
// antd
import { Select, message } from "antd";

interface Props {
  emptyValueText: string;
  width?: string | number;
  value?: "" | number;
  onChange?: (value: "" | number) => void;
}

const StoreSelect = function ({
  emptyValueText,
  width,
  value,
  onChange,
}: Props) {
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
    }
  );

  return (
    <Select //
      style={{ width }}
      loading={getStoresQuery.isLoading}
      defaultValue=""
      value={value && value}
      onChange={onChange && onChange}
    >
      <Select.Option value="">{emptyValueText}</Select.Option>
      {getStoresQuery.data?.data.data.map((store) => {
        const { id, name } = store;
        return (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default StoreSelect;
