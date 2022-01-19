import { Form, Input, message, Select, Space } from "antd";
import { basicDataAPI } from "apis";
import { AxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

interface Address {
  building: string;
  floor: string;
  col: string;
  loc: string;
  ext: string;
}

function AddressSelect() {
  const { t } = useTranslation();

  const [address, setAddress] = useState<Address>({
    building: "",
    floor: "",
    col: "",
    loc: "",
    ext: "",
  });

  const getAddressQuery = useQuery("getAddress", basicDataAPI.getAddress, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  return (
    <Form.Item label={t("vendor.address")} required={true}>
      <Space>
        <Form.Item //
          name={["address", "building"]}
          noStyle
          rules={[{ required: true }]}
        >
          <Select // 건물 select
            placeholder={t("placeholder.building")}
            style={{ width: "10rem" }}
            onChange={(value: string) => {
              setAddress({ building: value, floor: "", col: "", loc: "", ext: "" });
            }}
          >
            {getAddressQuery.data &&
              Object.keys(getAddressQuery.data.data).map((building) => (
                <Select.Option key={building} value={building}>
                  {building}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item //
          name={["address", "floor"]}
          noStyle
          rules={[{ required: true }]}
        >
          <Select // 층 select
            placeholder={t("placeholder.floor")}
            style={{ width: "10rem" }}
            onChange={(value: string) => {
              setAddress({ ...address, floor: value, col: "", loc: "", ext: "" });
            }}
          >
            {getAddressQuery.data &&
              address.building &&
              Object.keys(getAddressQuery.data.data[address.building]).map((value) => (
                <Select.Option key={value} value={value}>
                  {`${value}층`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item //
          name={["address", "col loc"]}
          noStyle
          rules={[{ required: true }]}
        >
          <Select // 열,호 select
            placeholder={t("placeholder.col loc")}
            style={{ width: "10rem" }}
            onChange={(value: string) => {
              const [col, loc] = value.split(" ");
              setAddress({ ...address, col: col, loc: loc, ext: "" });
            }}
          >
            {getAddressQuery.data &&
              address.building &&
              address.floor &&
              Object.values(getAddressQuery.data.data[address.building][address.floor]).map(
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
        <Form.Item
          name={["address", "ext"]}
          noStyle
          rules={[{ required: true, message: "Province is required" }]}
        >
          <Input style={{ width: "12rem" }} />
        </Form.Item>
      </Space>
    </Form.Item>
  );
}

export default AddressSelect;
