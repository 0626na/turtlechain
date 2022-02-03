import { Form, FormInstance, Input, message, Select } from "antd";
import { basicDataAPI } from "apis";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

function AddressSelect() {
  const { t } = useTranslation();

  const getAddressQuery = useQuery("getAddress", basicDataAPI.getAddress, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const address = getAddressQuery.data?.data;

  const [selectedAddress, selectAddress] = useState({
    building: "",
    floor: "",
    col: "",
    loc: "",
  });

  // AddressSelect 컴포넌트가 사라질때, 상태 초기화
  useEffect(() => {
    return selectAddress({ building: "", floor: "", col: "", loc: "" });
  }, []);

  useEffect(() => {
    console.log(selectedAddress);
  }, [selectedAddress]);

  return (
    <Form.Item label={t("vendor.address")} required={false}>
      <Input.Group compact>
        <Form.Item //
          noStyle
          rules={[{ required: false, whitespace: true }]}
        >
          <Select // 건물 select
            placeholder={t("placeholder.building")}
            size="large"
            style={{ width: "32.5%" }}
            value={selectedAddress.building}
            onChange={(value: string) => {
              selectAddress({ building: value, floor: "", col: "", loc: "" });
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
          noStyle
          rules={[{ required: false }]}
        >
          <Select // 층 select
            size="large"
            placeholder={t("placeholder.floor")}
            style={{ width: "32%" }}
            value={selectedAddress.floor}
            onChange={(value: string) => {
              selectAddress({ ...selectedAddress, floor: value, col: "", loc: "" });
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
          noStyle
          rules={[{ required: false }]}
        >
          <Select // 열,호 select
            size="large"
            placeholder={t("placeholder.col loc")}
            value={`${selectedAddress.col} ${selectedAddress.loc}`}
            style={{ width: "32%" }}
            onChange={(value: string) => {
              const [col, loc] = value.split(" ");
              selectAddress({ ...selectedAddress, col: col, loc: loc });
            }}
          >
            {selectedAddress.floor &&
              Object.values(address[selectedAddress.building][selectedAddress.floor]).map(
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
