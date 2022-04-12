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
import { useRecoilState, useRecoilValue } from "recoil";
import { clearingCartState } from "store/clearingCartState";
import useClearingCart from "hooks/useClearingCart";
import { TurtleButton } from "components/common";
import { useMutation, useQuery } from "react-query";
import { adjustmentAPI, clearingAPI } from "apis";
import { AxiosError } from "axios";
import { storeState } from "store/storeState";
import moment from "moment";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickCreate: () => void;
}

function ClearingPanel({ activeKey, clickCreate, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const [totalDepositPrice, totalVatPrice, totalSubtractPrice, totalReservePrice, totalPrice] =
    useClearingCart();

  const getTodayReserveListQuery = useQuery(
    ["getTodayReserveList"],
    () =>
      adjustmentAPI.getList({
        rt_store_id: store.id,
        is_cleared: 0,
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD"),
        type: "reserve",
        original_id: 0,
      }),
    {
      enabled: activeKey === "3",
      onSuccess: (data) => {
        console.log(data.data.adjustment_list);
        setCart({
          ...cart,
          reserve_item_list: data.data.adjustment_list.map((item) => ({
            adjustment_item_id: item.id,
            ws_store_id: item.ws_store_id,
            vendor_id: item.vendor_info.id,
            price: item.price * item.count,
            is_vat_included: item.is_vat_included,
          })),
        });
      },
    },
  );

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
          <Col span={3}>입고 금액 (+)</Col>
          <Col>
            {(totalDepositPrice ?? 0).toLocaleString()} 원 (부가세{" "}
            {(totalVatPrice ?? 0).toLocaleString()}원 포함)
          </Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>차감 금액 (-)</Col>
          <Col>{(totalSubtractPrice ?? 0).toLocaleString()} 원</Col>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row>
          <Col span={3}>당일 미송 (+)</Col>
          <Col>{(totalReservePrice ?? 0).toLocaleString()} 원</Col>
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
                  store_id: store.id,
                  store_name: store.name,
                  clearing_total_price: totalPrice!,
                  total_vat_price: totalVatPrice!,
                },
                item: {
                  rt_store_id: store.id,
                  rt_store_name: store.name,
                  warehousing_item_list: cart.warehousing_item_list,
                  subtract_item_list: cart.subtract_item_list,
                  reserve_item_list: cart.reserve_item_list,
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
