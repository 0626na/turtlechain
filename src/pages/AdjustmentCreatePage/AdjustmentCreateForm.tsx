import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button, InputNumber, Card, Select } from "antd";

interface Props {}

const AdjustmentCreateForm = function ({}: Props) {
  const { t } = useTranslation();
  return (
    <Form layout="vertical">
      <Card style={{ backgroundColor: "#fbfbfb" }}>
        <Form.Item>
          <Button //
            type="primary"
            icon={<SearchOutlined />}
          >
            {t("search client")}
          </Button>
        </Form.Item>
        <ItemGroup>
          <Form.Item //
            label={t("client name")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            label={t("client address")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item //
            label={t("account info")}
            rules={[{ required: true }]}
          >
            <Input readOnly />
          </Form.Item>
        </ItemGroup>
        <ItemGroup>
          <Form.Item //
            label={t("adjustment type")}
            rules={[{ required: true }]}
          >
            <Select style={{ width: 200 }} />
          </Form.Item>
          <Form.Item //
            label={t("supply price")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label=" ">
            <Button //
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
            >
              {t("create")}
            </Button>
          </Form.Item>
        </ItemGroup>
      </Card>
    </Form>
  );
};

const ItemGroup = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default AdjustmentCreateForm;
