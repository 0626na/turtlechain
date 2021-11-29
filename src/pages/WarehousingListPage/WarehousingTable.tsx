import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Table, Form, Select, DatePicker, Button, Typography } from "antd";
import SimplePagination from "components/SimplePagination";

const TableTop = () => {
  const { t } = useTranslation();
  return (
    <TopContainer>
      <Form layout="inline">
        <Form.Item label={t("mall name")}>
          <Select defaultValue="all">
            <Select.Option value="all">{t("all")}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={t("warehousing time")}>
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
    </TopContainer>
  );
};

const TableBottom = () => {
  const { t } = useTranslation();
  return (
    <BottomContainer>
      <Typography.Text strong>{`${t("all")} : 1000`}</Typography.Text>
      <SimplePagination
        currentPage={1}
        pageSize={1}
        totalCount={1}
        isLoading={false}
        onPrev={() => {}}
        onNext={() => {}}
      />
    </BottomContainer>
  );
};

const WarehousingTable = function () {
  const { t } = useTranslation();

  return (
    <Table
      bordered
      size="small"
      scroll={{ y: 400 }}
      pagination={false}
      title={TableTop}
      footer={TableBottom}
      columns={[
        {
          title: t("mall name"),
          dataIndex: "mall_name",
        },
        {
          title: t("warehousing time"),
          dataIndex: "warehousing_time",
        },
        {
          title: t("warehousing quantity"),
          dataIndex: "warehousing_quantity",
        },
        {
          title: t("warehousing amount"),
          dataIndex: "warehousing_amount",
        },
        {
          title: "",
          dataIndex: "action",
          render: (text, record) => (
            <Button size="small" type="primary">
              {t("view details")}
            </Button>
          ),
        },
      ]}
      dataSource={[
        {
          mall_name: "딘트",
          warehousing_time: "2020-01-01 01:01",
          warehousing_quantity: 3000,
          warehousing_amount: 5000000,
        },
      ]}
    />
  );
};

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default WarehousingTable;
