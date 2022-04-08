import { t } from "i18next";
import { Collapse, message, Row, Table, Typography, CollapsePanelProps, Space } from "antd";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleButton } from "components/common";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { WarehousingProductShow, WarehousingSheet } from "apis/warehousingAPI";
import { useRecoilState, useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import WarehousingDetailModal from "./WarehousingDetailModal";
import { cartState } from "store/cartState";
import useCart from "hooks/useCart";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function WarehousingPanel({ activeKey, clickNext, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(cartState);
  const [totalDepositPrice, totalVatPrice] = useCart();
  const [DetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSheet, selectSheet] = useState<WarehousingSheet>();

  const getWarehousingSheetQuery = useQuery(
    ["getWarehousingSheet", activeKey, store.id], //
    () =>
      warehousingAPI.getSheet({
        rt_store_id: store.id!,
        is_confirmed: 0,
        start_date: "2017-01-01",
        end_date: "9999-12-31",
        did_settlement: 0,
        page: 1,
      }),
    {
      enabled: activeKey === "1" && !!store.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        resetStates();
      },
    },
  );

  const resetStates = useCallback(() => {
    setCart({ selectedKeys: [], warehousing_item_list: [], subtract_item_list: [] });
    selectSheet(undefined);
  }, [setCart]);

  // 입고 확정 버튼 클릭
  const checkSheet = useCallback(
    (itemList: WarehousingProductShow[]) => {
      setCart({
        selectedKeys: [...cart.selectedKeys, selectedSheet?.id!],
        warehousing_item_list: [
          ...cart.warehousing_item_list,
          ...itemList.map((item) => {
            const {
              id,
              sheet_id,
              is_vat_included,
              price,
              count,
              vendor_info: { id: vendor_id, ws_store_id },
            } = item;
            // (도매에게) 이체금액
            const deposit_price = count * price;
            // 부가세
            const vat_price = count * (is_vat_included ? Math.floor(deposit_price / 11) : 0);
            // 공급가
            const supply_price = count * (deposit_price - vat_price);
            // (소매가) 발행금액
            const total_price =
              count * (is_vat_included ? deposit_price : Math.floor(deposit_price * 1.1));
            return {
              sheet_id,
              warehousing_item_id: id,
              ws_store_id,
              vendor_id,
              vat_price,
              supply_price,
              deposit_price,
              total_price,
            };
          }),
        ],
        subtract_item_list: [],
      });
      setDetailModalVisible(false);
    },
    [selectedSheet, cart, setCart],
  );

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  // 입고 확정 모달 열기
  const openDetailModal = useCallback(
    (record) => {
      // 이미 체크되어 있다면 체크 해제, 장바구니 제거
      if (cart.selectedKeys.includes(record.id)) {
        setCart({
          ...cart,
          selectedKeys: cart.selectedKeys.filter((key) => key !== record.id),
          warehousing_item_list: cart.warehousing_item_list.filter(
            (item) => item.sheet_id !== record.id,
          ),
        });
        return;
      }
      selectSheet(record);
      setDetailModalVisible(true);
    },
    [cart, setCart],
  );

  return (
    <Collapse.Panel
      {...props}
      extra={
        <Space>
          <Typography.Text style={{ color: "#5B5D63" }}>
            입고 총 금액: {(totalDepositPrice ?? 0).toLocaleString()} 원
          </Typography.Text>
          <Typography.Text style={{ color: "#5B5D63" }}>
            (부가세 {(totalVatPrice ?? 0).toLocaleString()}원 포함)
          </Typography.Text>
        </Space>
      }
    >
      <Table
        size="small"
        pagination={false}
        loading={getWarehousingSheetQuery.isLoading}
        dataSource={getWarehousingSheetQuery.data?.sheet_list}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: cart.selectedKeys,
          onSelect: openDetailModal,
          hideSelectAll: true,
        }}
        onRow={(record) => ({
          onClick: () => {
            openDetailModal(record);
          },
        })}
        columns={[
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("warehousing.date"),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: "거래처 수",
            render: (_, record) => record.total_store_count,
          },
          {
            ellipsis: true,
            title: t("warehousing.price"),
            render: (_, record) => record.total_price.toLocaleString(),
          },
        ]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton //
          children={t("button.next step")}
          onClick={clickNext}
          disabled={cart.selectedKeys.length === 0}
        />
      </Row>

      {/* 입고 상세보기 모달 */}
      <WarehousingDetailModal
        visible={DetailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
        }}
        sheet={selectedSheet}
        onOk={checkSheet}
      />
    </Collapse.Panel>
  );
}

export default WarehousingPanel;
