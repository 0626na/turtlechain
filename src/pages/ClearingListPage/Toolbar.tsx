import { Col, Row, Space, Typography, Select, DatePicker } from "antd";
import TurtleButton from "components/common/TurtleButton";
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
            <TurtleButton
              onClick={() => {
                window.alert("준비중입니다.");
              }}
              type="primary"
            >
              {t("button.download list")}
            </TurtleButton>
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
              onClear={() => {
                setSearchQuery({ ...searchQuery, start_date: "", end_date: "" });
                setSearchState({ ...searchState, clearing_date: undefined });
              }}
            >
              <Select.Option value={"request_date"} key={1}>
                {t("clearing.date.request")}
              </Select.Option>
              <Select.Option value={"complete_date"} key={2}>
                {t("clearing.date.complete")}
              </Select.Option>
            </Select>
            <DatePicker.RangePicker
              disabled={searchState.clearing_date === undefined}
              allowClear={true}
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
