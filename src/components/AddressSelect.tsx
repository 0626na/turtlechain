import { Col, Form, FormInstance, Input, message, Row, Select, Space } from "antd";
import { basicDataAPI } from "apis";
import { RequestCreateBucketList } from "apis/bucketListAPI";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

interface Props {
  form: FormInstance<{
    building: string;
    floor: string;
    col_loc: string;
    ext: string;
  }>;
}

function AddressSelect({ form }: Props) {
  const { t } = useTranslation();

  const getAddressQuery = useQuery("getAddress", basicDataAPI.getAddress, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  // building 이 바뀔 때 마다, floor select 리랜더링
  useEffect(() => {
    console.log("change building");
  }, []);

  // floor 바뀔 때 마다, col_loc select 리랜더링

  return (
    <Form.Item label={t("vendor.address")} required={false} wrapperCol={{ span: 24, offset: 1 }}>
      <Input.Group compact>
        <Form.Item //
          name="building"
          noStyle
          rules={[{ required: false }]}
        >
          <Select // 건물 select
            placeholder={t("placeholder.building")}
            style={{ width: "20%" }}
            onChange={(value: string) => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                building: value,
                floor: "",
                col_loc: "",
                ext: "",
              });
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
          name="floor"
          noStyle
          rules={[{ required: false }]}
        >
          <Select // 층 select
            placeholder={t("placeholder.floor")}
            style={{ width: "15%" }}
            onChange={(value: string) => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                floor: value,
                col_loc: "",
                ext: "",
              });
            }}
          >
            {getAddressQuery.data &&
              form.getFieldValue("building") &&
              Object.keys(getAddressQuery.data.data[form.getFieldValue("building")]).map(
                (value) => {
                  return (
                    <Select.Option key={value} value={value}>
                      {`${value}층`}
                    </Select.Option>
                  );
                },
              )}
          </Select>
        </Form.Item>
        <Form.Item //
          name="col_loc"
          noStyle
          rules={[{ required: false }]}
        >
          <Select // 열,호 select
            placeholder={t("placeholder.col loc")}
            style={{ width: "15%" }}
            onChange={(value: string) => {
              form.setFieldsValue({
                ...form.getFieldsValue(),
                col_loc: value,
                ext: "",
              });
            }}
          >
            {getAddressQuery.data &&
              form.getFieldValue("building") &&
              Object.values(
                getAddressQuery.data.data[form.getFieldValue("building")][
                  form.getFieldValue("floor")
                ],
              ).map((value: any, index) => {
                const [col, loc] = value.split(" ");
                return (
                  <Select.Option key={index} value={value}>
                    {col ? `${col}열 ${loc}호` : `${loc}호`}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="ext"
          noStyle
          rules={[{ required: false, message: "기타 주소 입력해주세요" }]}
        >
          <Input //
            style={{ width: "20%" }}
            placeholder={t("placeholder.ext")}
          />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
}

export default AddressSelect;
