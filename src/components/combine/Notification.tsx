import { Col, message, Popover, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { BellOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import notificationAPI from "apis/notificationAPI";
import { AxiosError } from "axios";

function Notification() {
  const getQuery = useQuery("getNotification", () => notificationAPI.get({ type: "home" }), {
    enabled: false,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  return (
    <StyledPopover
      getPopupContainer={(triggerNode) => triggerNode}
      placement="bottomRight"
      trigger="click"
      content={
        <>
          <div style={{ backgroundColor: "#F1FAF8" }}>
            <Row style={{ borderBottom: "1px solid #DCE0E4", padding: "12px 20px" }}>
              <Space direction="vertical">
                <Col>
                  요청하신 거래처 블링블링의 계좌정보가 수정되었습니다.
                  <br /> 확인 후 정확한 세부 정보를 선택해주세요
                </Col>
                <Col>
                  <Typography.Text style={{ color: "#00B594", cursor: "pointer" }}>
                    거래처 정보 확인 &nbsp;
                  </Typography.Text>
                  <Typography.Text type="secondary">| &nbsp;2021-02-21 오전 09:32</Typography.Text>
                </Col>
              </Space>
            </Row>
          </div>
          <Row style={{ borderBottom: "1px solid #DCE0E4", padding: "12px 20px" }}>
            <Space direction="vertical">
              <Col>
                요청하신 거래처 블링블링의 계좌정보가 수정되었습니다.
                <br /> 확인 후 정확한 세부 정보를 선택해주세요
              </Col>
              <Col>
                <Typography.Text style={{ color: "#00B594", cursor: "pointer" }}>
                  거래처 정보 확인 &nbsp;
                </Typography.Text>
                <Typography.Text type="secondary">| &nbsp;2021-02-21 오전 09:32</Typography.Text>
              </Col>
            </Space>
          </Row>
          <Row
            style={{ backgroundColor: "#DCE0E4", height: 40, cursor: "pointer" }}
            justify="center"
            align="middle"
            onClick={() => {
              alert("전체보기");
            }}
          >
            알림 전체보기
          </Row>
        </>
      }
    >
      <BellOutlined
        style={{
          padding: 8,
          marginRight: 12,
          fontSize: 20,
          cursor: "pointer",
        }}
      />
    </StyledPopover>
  );
}

const StyledPopover = styled(Popover)`
  .ant-popover-inner-content {
    padding: 0px;
  }
`;

export default Notification;
