import { Col, Row, Space, Typography, Select, DatePicker } from "antd";
import TurtleButton from "components/common/TurtleButton";
import { useTranslation } from "react-i18next";
import StoreSelect from "components/StoreSelect";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { RequestGetClearingSheet } from "apis/clearingAPI";

interface Props {
  selectStore: (storeId: number | "") => void;
  searchQuery: RequestGetClearingSheet;
  setSearchQuery: Dispatch<SetStateAction<RequestGetClearingSheet>>;
}

function Toolbar({ selectStore, searchQuery, setSearchQuery }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Row gutter={24} align="middle" justify="space-between">
        <Col>
          <Space size="large">
            <StoreSelect selectStore={selectStore} />
          </Space>
        </Col>
        <Col>
          <Space>
            <TurtleButton type="primary">{t("button.download vendor")}</TurtleButton>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space size="large">
            <Typography.Text style={{ fontSize: "16px" }}>{"검색"}</Typography.Text>
            <Select placeholder={t("placeholder.clearing_status")} style={{ width: 100 }}>
              <Select.Option value={t("clearing.status.all")} key={0}>
                {t("clearing.status.all")}
              </Select.Option>
              <Select.Option value={t("clearing.status.request")} key={1}>
                {t("clearing.status.request")}
              </Select.Option>
              <Select.Option value={t("clearing.status.pending")} key={2}>
                {t("clearing.status.pending")}
              </Select.Option>
              <Select.Option value={t("clearing.status.complete")} key={3}>
                {t("clearing.status.complete")}
              </Select.Option>
            </Select>
            <Select placeholder={t("placeholder.clearing_date")} style={{ width: 128 }}>
              <Select.Option value={undefined} key={undefined}>
                {undefined}
              </Select.Option>
              <Select.Option value={2} key={2}>
                일자1
              </Select.Option>
              <Select.Option value={3} key={3}>
                일자2
              </Select.Option>
            </Select>
            <DatePicker.RangePicker
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
