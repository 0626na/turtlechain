import { t } from "i18next";
import {
  Card,
  Col,
  Collapse,
  CollapsePanelProps,
  message,
  notification,
  Popconfirm,
  Row,
} from "antd";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { cartState } from "store/cartState";
import useCart from "hooks/useCart";
import { TurtleButton } from "components/common";
import { useMutation } from "react-query";
import { clearingAPI } from "apis";
import { AxiosError } from "axios";
import { storeState } from "store/storeState";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickCreate: () => void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const cart = useRecoilValue(cartState);
  const [totalDepositPrice, totalVatPrice, totalSubtractPrice, totalReservePrice, totalPrice] =
    useCart();

  const createClearingQuery = useMutation(["createClearing"], clearingAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data.msg);
    },
    onSuccess: (data) => {
      notification.open({
        type: "success",
        message: t("message.success create clearing"),
      });
      clickCreate();
    },
  });

  return (
    <Collapse.Panel {...props} style={{ border: "1px solid #e3e6ea" }}>
      <StyledCard>
        <Row>
          <Col span={3}>입고</Col>
          <Col>
            {(totalDepositPrice ?? 0).toLocaleString()} 원 (부가세{" "}
            {(totalVatPrice ?? 0).toLocaleString()}원 포함)
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>차감 금액</Col>
          <Col>-{(totalSubtractPrice ?? 0).toLocaleString()} 원</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>당일 미송</Col>
          <Col>0 원</Col>
        </Row>
      </StyledCard>

      <Row
        justify="space-between"
        align="middle"
        style={{
          marginTop: 16,
          paddingLeft: 16,
          paddingTop: 16,
          color: "#5b5d63",
          borderTop: "1px solid #e3e6ea",
        }}
      >
        <Col span={1}>
          <b>합계</b>
        </Col>
        <Col span={17}>
          <b>
            {(totalPrice ?? 0).toLocaleString()} 원 (부가세 {(totalVatPrice ?? 0).toLocaleString()}
            원 포함)
          </b>
        </Col>
        <Col>
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              createClearingQuery.mutate({
                sheet: {
                  store_id: store.id!,
                  store_name: store.name!,
                  clearing_total_price: totalPrice!,
                  total_vat_price: totalVatPrice!,
                },
                item: {
                  rt_store_id: store.id!,
                  rt_store_name: store.name!,
                  warehousing_item_list: cart.warehousing_item_list,
                  adjustment_item_list: cart.adjustment_item_list,
                },
              });
            }}
          >
            <TurtleButton>{t("button.request clearing")}</TurtleButton>
          </Popconfirm>
        </Col>
      </Row>
    </Collapse.Panel>
  );
}

const StyledCard = styled(Card)`
  border: none;
  .ant-card-body {
    padding: 6px 16px;
    color: #5b5d63;
    background-color: #fbfcfe;
  }
`;

export default ClearingPanel;
