import { Button, Card, Col, message, Row } from "antd";
import { userAPI } from "apis";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

function PageBody() {
  const getQuery = useQuery("getUser", () => userAPI.get(), {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  return (
    <>
      <Row>
        <Card
          type="inner"
          title="기본 정보"
          style={{ width: "100%" }}
          headStyle={{ backgroundColor: "#F6F9FD" }}
        >
          <Row style={{ margin: "16px 0" }}>
            <Col span={4}>이름</Col> <Col>{getQuery.data?.name}</Col>
          </Row>
          <Row style={{ margin: "16px 0" }}>
            <Col span={4}>이메일</Col> <Col>{getQuery.data?.email}</Col>
          </Row>
          <Row style={{ margin: "16px 0" }}>
            <Col span={4}>휴대번호</Col> <Col>{getQuery.data?.mobile_phone}</Col>
          </Row>
        </Card>
      </Row>
      <Row>
        <Card
          type="inner"
          title="계정 정보"
          style={{ width: "100%", marginBottom: 24 }}
          headStyle={{ backgroundColor: "#F6F9FD" }}
        >
          <Row style={{ margin: "16px 0" }}>
            <Col span={4}>아이디</Col> <Col>{getQuery.data?.login_id}</Col>
          </Row>
          <Row style={{ margin: "16px 0" }}>
            <Col span={4}>비밀번호</Col>{" "}
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  alert("준비중입니다.");
                }}
              >
                재설정
              </Button>
            </Col>
          </Row>
        </Card>
      </Row>
    </>
  );
}

export default PageBody;
