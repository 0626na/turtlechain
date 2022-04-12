import { Form, Input, message, Select } from "antd";
import { basicDataAPI } from "apis";
import { StoreAddress } from "apis/bucketListAPI";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { useQuery } from "react-query";
import { t } from "i18next";

interface Props {
  selectedAddress: StoreAddress;
  selectAddress: Dispatch<SetStateAction<StoreAddress>>;
}

function AddressSelect({ selectedAddress, selectAddress }: Props) {
  const getAddressQuery = useQuery("getAddress", basicDataAPI.getAddress, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const address = getAddressQuery.data?.data;

  return (
    <Form.Item label={t("vendor.address")} required={true}>
      <Input.Group compact>
        <Form.Item //
          //name="building"
          noStyle
          rules={[{ required: true, message: "상가명 입력해주세요" }]}
        >
          <Select // 건물 select
            placeholder={t("placeholder.building")}
            style={{ width: "34%" }}
            value={selectedAddress.building}
            onChange={(value: string) => {
              selectAddress({ building: value, floor: undefined, col: undefined, loc: undefined });
            }}
          >
            {address &&
              Object.keys(address).map((building) => (
                <Select.Option key={building} value={building}>
                  {building}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item //
          //name="floor"
          noStyle
          rules={[{ required: true, message: "층 입력해주세요" }]}
        >
          <Select // 층 select
            placeholder={t("placeholder.floor")}
            style={{ width: "33%" }}
            value={selectedAddress.floor}
            onChange={(value: string) => {
              selectAddress({ ...selectedAddress, floor: value, col: undefined, loc: undefined });
            }}
          >
            {selectedAddress?.building &&
              Object.keys(address[selectedAddress.building]).map((value) => {
                return (
                  <Select.Option key={value} value={value}>
                    {`${value}층`}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item //
          //name="col"
          noStyle
          rules={[{ required: true, message: "열·호 입력해 주세요" }]}
        >
          <Select // 열,호 select
            placeholder={t("placeholder.col loc")}
            value={`${selectedAddress.col ?? ""} ${selectedAddress.loc ?? ""}`}
            style={{ width: "33%" }}
            onChange={(value: string) => {
              const [col, loc] = value.split(" ");
              selectAddress({ ...selectedAddress, col: col, loc: loc });
            }}
          >
            {selectedAddress.floor &&
              Object.values(address[selectedAddress.building ?? ""][selectedAddress.floor]).map(
                (value: any, index) => {
                  const [col, loc] = value.split(" ");
                  return (
                    <Select.Option key={index} value={value}>
                      {col ? `${col}열 ${loc}호` : `${loc}호`}
                    </Select.Option>
                  );
                },
              )}
          </Select>
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
}

export default AddressSelect;
