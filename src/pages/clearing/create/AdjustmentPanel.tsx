import { t } from "i18next";
import { Collapse, CollapsePanelProps, InputNumber, Row, Space, Table, Typography } from "antd";
import { TurtleButton, TurtleQuestionTooltip } from "components/common";
import { clearingAPI } from "apis";
import { useQuery } from "react-query";
import { clearingCartState } from "store/clearingCartState";
import { useRecoilState } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { BalanceShow } from "apis/clearingAPI";
import { pricePattern } from "utils/pattern";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function AdjustmentPanel({ activeKey, clickNext, ...props }: Props) {
  const [cart, setCart] = useRecoilState(clearingCartState);
  const [balanceList, setBalanceList] = useState<BalanceShow[]>([]);

  const getBalanceQuery = useQuery(
    ["getBalance"],
    () =>
      clearingAPI.getBalance({
        warehousing_sheet_id: cart.selectedKeys
          .map((id) => String(id))
          .reduce((cur, acc) => cur + acc + "@", "")
          .slice(0, -1),
      }),
    {
      enabled: activeKey === "2",
      onSuccess: (data) => {
        setBalanceList(
          data.data.item_list.map((balanceItem) => ({
            ...balanceItem,
            warehousing_amount: cart.warehousing_item_list
              .filter((warehousingItem) => balanceItem.vendor_info.id === warehousingItem.vendor_id)
              .map((warehousingItem) => warehousingItem.deposit_price)
              .reduce((cur, acc) => cur + acc, 0),
          })),
        );
      },
    },
  );

  // 차감 총 금액 판넬안에서 바뀌게 하기위함
  const totalBalance = useMemo(
    () => balanceList.map((item) => item.subtract_price ?? 0).reduce((cur, acc) => cur + acc, 0),
    [balanceList],
  );

  // cart에 차감금액이 없을 시 balanceList 초기화 (totalBalance 초기화 위함)
  useEffect(() => {
    if (cart.subtract_item_list.length === 0) {
      setBalanceList([]);
    }
  }, [cart.subtract_item_list]);

  return (
    <Collapse.Panel
      {...props}
      extra={
        <Typography.Text style={{ color: "#5B5D63" }}>
          차감 총 금액: {totalBalance.toLocaleString()} 원
        </Typography.Text>
      }
    >
      <Table
        size="small"
        pagination={false}
        loading={getBalanceQuery.isLoading}
        dataSource={balanceList}
        rowKey="id"
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: "사용 가능 금액",
            render: (_, record) => record.overpaid_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            title: (
              <>
                사용할 금액
                <TurtleQuestionTooltip content="사용할 금액은 당일 입고 금액을 초과할 수 없습니다." />
              </>
            ),
            render: (_, record) => (
              <Space>
                <InputNumber
                  size="small"
                  formatter={(value) => `${value}`.replace(pricePattern, ",")}
                  placeholder="금액 입력"
                  step={1000}
                  min={0}
                  max={Math.min(record.overpaid_amount, record.warehousing_amount ?? 0)}
                  value={record.subtract_price}
                  onChange={(value) => {
                    setBalanceList(
                      balanceList.map((item) =>
                        item.id === record.id ? { ...item, subtract_price: value } : item,
                      ),
                    );
                  }}
                />
              </Space>
            ),
          },
        ]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton //
          children={t("button.next step")}
          onClick={() => {
            setCart({
              ...cart,
              subtract_item_list: balanceList
                .filter((item) => item.subtract_price !== undefined)
                .map((item) => ({
                  ws_store_id: item.vendor_info.ws_store_id,
                  vendor_id: item.vendor_info.id,
                  price: item.subtract_price!,
                  is_vat_included: item.vendor_info.is_vat_included,
                })),
            });
            clickNext();
          }}
        />
      </Row>
    </Collapse.Panel>
  );
}

export default AdjustmentPanel;
