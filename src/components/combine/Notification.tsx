import { Col, Divider, message, Popover, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { BellOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import notificationAPI from "apis/notificationAPI";
import { AxiosError } from "axios";

function Notification() {
  const getQuery = useQuery("getNotification", () => notificationAPI.get({ type: "home" }), {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <StyledPopover
      getPopupContainer={(triggerNode) => triggerNode}
      placement="bottomRight"
      trigger="click"
      content={
        <>
          <div style={{ backgroundColor: "#F4FEFC" }}>
            <Row style={{ borderBottom: "1px solid #F0F0F1", padding: "12px 20px" }}>
              <Space direction="vertical">
                <Col>
                  요청하신 거래처 블링블링의 계좌정보가 수정되었습니다.
                  <br /> 확인 후 정확한 세부 정보를 선택해주세요.
                </Col>
                <Col>
                  <Typography.Text style={{ color: "#00B594", cursor: "pointer", fontSize: 13 }}>
                    거래처 정보 확인
                  </Typography.Text>
                  <Divider type="vertical" />
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    2021-02-21 오전 09:32
                  </Typography.Text>
                </Col>
              </Space>
            </Row>
          </div>
          <Row style={{ borderBottom: "1px solid #F0F0F1", padding: "12px 20px" }}>
            <Space direction="vertical">
              <Col>
                요청하신 거래처 블링블링의 계좌정보가 수정되었습니다.
                <br /> 확인 후 정확한 세부 정보를 선택해주세요.
              </Col>
              <Col>
                <Typography.Text style={{ color: "#00B594", cursor: "pointer", fontSize: 13 }}>
                  거래처 정보 확인
                </Typography.Text>
                <Divider type="vertical" />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  2021-02-21 오전 09:32
                </Typography.Text>
              </Col>
            </Space>
          </Row>
          <Row
            style={{ backgroundColor: "#F8F9FB", height: 40, cursor: "pointer" }}
            justify="center"
            align="middle"
            onClick={() => {
              alert("준비중 입니다.");
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
