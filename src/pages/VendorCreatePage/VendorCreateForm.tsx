import { Button, Form, Input, message, Row, Select, Space, Switch } from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleInput from "components/common/TurtleInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";
import { useState } from "react";
import { useQuery } from "react-query";

function VendorCreateForm() {
  const [form] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState<{
    type: string;
    search_query: string;
  }>({
    type: "all",
    search_query: "",
  });

  const searchVendorQuery = useQuery(
    ["searchVendor", searchQuery],
    () => vendorAPI.searchVendor(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  function onChange(value: string) {
    console.log(`selected ${value}`);
  }

  function onSearch(value: string) {
    console.log("search:", value);
    setSearchQuery({ ...searchQuery, search_query: value });
    console.log(searchVendorQuery.data);
  }

  return (
    <>
      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 7 }}
        colon={false}
      >
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <Form.Item name="name" label={t("vendor.name")} required={true}>
          <Select
            showSearch
            style={{ width: "96%" }}
            placeholder={t("placeholder.vendor name")}
            optionFilterProp="children"
            size="large"
            onChange={onChange}
            onSearch={onSearch}
            /*
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
          */
          >
            <Select.Option value="1">Not Identified</Select.Option>
            <Select.Option value="2">Closed</Select.Option>
            <Select.Option value="3">Communicated</Select.Option>
            <Select.Option value="4">Identified</Select.Option>
            <Select.Option value="5">Resolved</Select.Option>
            <Select.Option value="6">Cancelled</Select.Option>
          </Select>
        </Form.Item>
        <TurtleInput // 거래처 매장번호 Input
          name="phone"
          label={t("vendor.phone")}
          disabled={true}
        />
        <Form.Item // 휴대번호 선택 Select
          name="store_phone"
          label={t("vendor.store phone")}
          required={true}
        >
          <Select placeholder="휴대번호를 선택해주세요" size="large" style={{ width: "96%" }}>
            <Select.Option value="01022223333">01022223333</Select.Option>
            <Select.Option value="01033334444">01033334444</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item // 거래처 주소 Input
          label={t("vendor.address")}
          required={true}
        >
          <Input.Group compact>
            <Form.Item name="building" noStyle rules={[{ required: true }]}>
              <Input disabled={true} size="large" style={{ width: "32.5%" }}></Input>
            </Form.Item>
            <Form.Item name="floor" noStyle rules={[{ required: true }]}>
              <Input disabled={true} size="large" style={{ width: "32%" }}></Input>
            </Form.Item>
            <Form.Item name="col_loc" noStyle rules={[{ required: true }]}>
              <Input disabled={true} size="large" style={{ width: "32%" }}></Input>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          disabled={true}
        />

        <Form.Item
          label={t("vendor.code")}
          required={true}
          name="vendor.id"
          rules={[{ required: true }]}
        >
          <Space>
            <Input readOnly={true} size="large" />
            <TurtleButton ghost>코드 만들기</TurtleButton>
          </Space>
        </Form.Item>

        <Form.Item label="부가세 포함 여부" valuePropName="checked" required={true}>
          <Switch //
            checkedChildren={t("button.include")}
            style={{ width: "53px" }}
          />
        </Form.Item>
        <TurtleText>{t("vendor.account info")}</TurtleText>
        <TurtleText>{t("vendor.biz info")}</TurtleText>
        <TurtleText>{t("common.etc")}</TurtleText>
        <TurtleTextArea // 주문 메모 TextArea
          name="vendor_memo"
          label={t("vendor.memo")}
          placeholder={t("placeholder.memo")}
        />
        <Row justify="center">
          <TurtleButton htmlType="submit" type="primary">
            {t("vendor.create")}
          </TurtleButton>
        </Row>
      </Form>
    </>
  );
}

export default VendorCreateForm;
