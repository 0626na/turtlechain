import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import moment from "moment";
// async
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import warehousingAPI, { RequestGetSheet } from "apis/warehousingAPI";
// antd
import {
  Table,
  Form,
  Button,
  Typography,
  DatePicker,
  Select,
  message,
} from "antd";
// components
import StoreSelect from "components/StoreSelect";
import SimplePagination from "components/SimplePagination";

const WarehousingList = function () {
  const { t } = useTranslation();

  const [query, setQuery] = useState<RequestGetSheet>({
    mall_id: "all",
    is_confirmed: "all",
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });

  // 쇼핑몰 정보 요청
  const { data: sheetData } = useQuery(
    ["getSheet", query],
    () => warehousingAPI.getSheet(query),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    }
  );

  return (
    <>
      <Form layout="inline">
        <Form.Item label={t("mall")}>
          <StoreSelect
            width={250}
            value={query.mall_id}
            onChange={(value) => setQuery({ ...query, mall_id: value })}
          />
        </Form.Item>
        <Form.Item label={t("warehousing time")}>
          <DatePicker.RangePicker
            allowClear={false}
            value={[moment(query.start_date), moment(query.end_date)]}
            onChange={(_, dateStrings) => {
              const start_date = dateStrings[0];
              const end_date = dateStrings[1];
              setQuery({ ...query, start_date, end_date });
            }}
          />
        </Form.Item>
        <Form.Item label={t("progress")}>
          <Select
            style={{ width: 100 }}
            value={query.is_confirmed}
            onChange={(value) => setQuery({ ...query, is_confirmed: value })}
          >
            <Select.Option value="all">{t("all")}</Select.Option>
            <Select.Option value={0}>
              {t("warehousing unconfirmed")}
            </Select.Option>
            <Select.Option value={1}>
              {t("warehousing confirmed")}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Table
        size="small"
        pagination={false}
        dataSource={sheetData ? sheetData.data : []}
        columns={[
          {
            title: t("mall name"),
            dataIndex: "mall_name",
          },
          {
            title: t("warehousing time"),
            dataIndex: "created_time",
            render: (_, record) => {
              return moment(record.created_time).format("YYYY-MM-DD HH:MM:SS");
            },
          },
          {
            title: t("warehousing quantity"),
            dataIndex: "total_item_count",
            align: "right",
            render: (_, record) => record.total_item_count.toLocaleString(),
          },
          {
            title: t("warehousing amount"),
            dataIndex: "total_price",
            align: "right",
            render: (_, record) => record.total_item_count.toLocaleString(),
          },
          {
            title: "",
            dataIndex: "action",
            align: "center",
            render: () => (
              <Button size="small" type="primary">
                {t("view details")}
              </Button>
            ),
          },
        ]}
        title={() => (
          <TopContainer>
            <Typography.Text strong>
              {`${t("warehousing")} ${t("list")}`}
            </Typography.Text>
          </TopContainer>
        )}
        footer={() => (
          <BottomContainer>
            <SimplePagination />
          </BottomContainer>
        )}
      />
    </>
  );
};

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default WarehousingList;
