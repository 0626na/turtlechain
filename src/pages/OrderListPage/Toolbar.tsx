import { Col, DatePicker, Row, Space, Typography } from "antd";
import { RequestGetList } from "apis/orderAPI";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";
import moment from "moment";

interface Props {
  searchQuery: RequestGetList;
  setSearchQuery: React.Dispatch<React.SetStateAction<RequestGetList>>;
}
function Toolbar({ searchQuery, setSearchQuery }: Props) {
  return (
    <Row
      gutter={24}
      align={"middle"}
      justify="space-between"
      style={{
        margin: "0",
        padding: "12px 12px",
        backgroundColor: "rgba(243,246,249, 0.4)",
      }}
    >
      <Col>
        <Space size="large">
          <StoreSelect />
          <Typography.Text style={{ fontSize: "16px" }}>{t("order.date")}</Typography.Text>
          <DatePicker.RangePicker
            value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
            onChange={(_, dateStrings) => {
              setSearchQuery({
                ...searchQuery,
                start_date: dateStrings[0],
                end_date: dateStrings[1],
              });
            }}
          />
        </Space>
      </Col>
      <Col>
        <Space>
          {/* <TurtleButtonSub icon="download">{t("button.download order list")}</TurtleButtonSub> */}
        </Space>
      </Col>
    </Row>
  );
}

export default Toolbar;
