import { Form, FormInstance, Input, message, Select } from "antd";
import { basicDataAPI } from "apis";
import { StoreAddress } from "apis/bucketListAPI";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

interface Props {
  selectedAddress: StoreAddress;
  selectAddress: Dispatch<SetStateAction<StoreAddress>>;
}

function AddressSelect({ selectedAddress, selectAddress }: Props) {
  const { t } = useTranslation();

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
          noStyle
          rules={[{ required: true, whitespace: true }]}
        >
          <Select // 건물 select
            placeholder={t("placeholder.building")}
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
          rules={[{ required: true }]}
        >
          <Select // 층 select
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
          rules={[{ required: true }]}
        >
          <Select // 열,호 select
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
