import { Col, Row, Space, Typography, Select, DatePicker } from "antd";
import TurtleButton from "components/common/TurtleButton";
import { useTranslation } from "react-i18next";
import StoreSelect from "components/StoreSelect";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { t } from "i18next";
import { searchStateProps } from "./index";

interface Props {
  searchQuery: RequestGetClearingSheet;
  setSearchQuery: Dispatch<SetStateAction<RequestGetClearingSheet>>;
  searchState: searchStateProps;
  setSearchState: Dispatch<SetStateAction<searchStateProps>>;
}

function Toolbar({ searchQuery, setSearchQuery, searchState, setSearchState }: Props) {
  return (
    <>
      <Row gutter={24} align="middle" justify="space-between">
        <Col>
          <Space size="large">
            <StoreSelect />
          </Space>
        </Col>
        <Col>
          <Space>
            <TurtleButton type="primary">{t("button.download list")}</TurtleButton>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space size="large">
            <Typography.Text style={{ fontSize: "16px" }}>{"검색"}</Typography.Text>
            <Select
              placeholder={t("placeholder.clearing_status")}
              style={{ width: 100 }}
              value={searchState.clearing_status}
              onChange={(value) => {
                setSearchState({
                  ...searchState,
                  clearing_status: value,
                });
              }}
            >
              <Select.Option value={"all"} key={0}>
                {t("clearing.status.all")}
              </Select.Option>
              <Select.Option value={"request"} key={1}>
                {t("clearing.status.request")}
              </Select.Option>
              <Select.Option value={"pending"} key={2}>
                {t("clearing.status.pending")}
              </Select.Option>
              <Select.Option value={"complete"} key={3}>
                {t("clearing.status.complete")}
              </Select.Option>
            </Select>
            <Select
              placeholder={t("placeholder.clearing_date")}
              value={searchState.clearing_date}
              style={{ width: 128 }}
              onChange={(value) => {
                setSearchState({
                  ...searchState,
                  clearing_date: value,
                });
              }}
              allowClear={true}
            >
              <Select.Option value={2} key={2}>
                {t("clearing.date.request")}
              </Select.Option>
              <Select.Option value={3} key={3}>
                {t("clearing.date.complete")}
              </Select.Option>
            </Select>
            <DatePicker.RangePicker
              disabled={searchState.clearing_date === undefined}
              allowClear={false}
              value={[
                searchQuery.start_date ? moment(searchQuery.start_date) : null,
                searchQuery.end_date ? moment(searchQuery.end_date) : null,
              ]}
              onChange={(_, dateStrings) => {
                const start_date = dateStrings[0];
                const end_date = dateStrings[1];
                setSearchQuery({ ...searchQuery, start_date, end_date });
              }}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default Toolbar;
